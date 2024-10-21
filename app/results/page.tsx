// respec-app\app\results\page.tsx

"use client";

import { useEffect, useState, useRef } from "react";

import { supabase } from "@/utils/client";
import { v4 as uuidv4 } from "uuid";

import { sendAudioToAPI } from "@/utils/audio-to-api";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Terminal } from "lucide-react";

import TimestampChart from "@/components/timestamp-chart";
import ResultsTable from "@/components/results-table";
import ResultsRatio from "@/components/results-ratio";
import ResultsSummary from "@/components/results-summary";
import SkeletonResults from "@/components/skeleton-results";

import useAudioStore from "@/components/store/audio-store";
import useResultsStore from "@/components/store/results-store";

const useUserSession = () => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
    };

    fetchSession();
  }, []);

  return session;
};

export default function Results() {
  const session = useUserSession();

  const { audioUrl, setAudioUrl } = useAudioStore();
  const {
    currentAudioUrl,
    setCurrentAudioUrl,
    audioFile,
    setAudioFile,
    timestampResult,
    setTimestampResult,
  } = useResultsStore();

  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [resultsId, setResultsId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPatientDialogOpen, setIsPatientDialogOpen] = useState(false);

  const patientNameRef = useRef<HTMLInputElement>(null);
  const ageRef = useRef<HTMLInputElement>(null);
  const contactDetailsRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const citizenshipRef = useRef<HTMLInputElement>(null);
  const civilStatusRef = useRef<HTMLInputElement>(null);

  const saveResultsToDatabase = async () => {
    if (!timestampResult) {
      setError("No results to save.");
      return;
    }

    const patientName = patientNameRef.current?.value;
    const age = ageRef.current?.value;
    const contactDetails = contactDetailsRef.current?.value;
    const address = addressRef.current?.value;
    const citizenship = citizenshipRef.current?.value;
    const civilStatus = civilStatusRef.current?.value;

    if (
      !patientName ||
      !age ||
      !contactDetails ||
      !address ||
      !citizenship ||
      !civilStatus
    ) {
      setError("Please fill in all the patient details.");
      return;
    }

    const uniqueId = uuidv4();
    setResultsId(uniqueId);

    setIsSaving(true);
    try {
      const { error: insertError } = await supabase
        .from("timestamp_results")
        .insert([
          {
            id: uniqueId,
            results: timestampResult,
            patient_name: patientName,
            age: age,
            contact_details: contactDetails,
            address: address,
            citizenship: citizenship,
            civil_status: civilStatus,
            user_id: session?.user.id,
          },
        ]);

      if (insertError) {
        throw new Error("Error saving results to the database");
      }

      setIsSaving(false);
      setIsDialogOpen(true);
      setIsPatientDialogOpen(false);
    } catch (err) {
      console.error(err);
      setError("Failed to save results.");
      setIsSaving(false);
    }
  };

  useEffect(() => {
    console.log("running useEffect on page load");

    if (!currentAudioUrl || timestampResult) return;

    const fetchResults = async () => {
      console.log("running fetchResults");

      try {
        // Fetch the audio file from the currentAudioUrl
        const response = await fetch(currentAudioUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch audio file");
        }

        const audioBlob = await response.blob();
        // console.log("audioBlob:", audioBlob);
        const filename = `audio_${Date.now()}.wav`;
        const extractedAudioFile = new File([audioBlob], filename, {
          type: "audio/wav",
        });

        setAudioFile(extractedAudioFile); // Optionally set audioFile state

        // Use the extractedAudioFile to send to API
        const timestampData = await sendAudioToAPI(
          extractedAudioFile,
          "/timestamp"
        );

        setTimestampResult(timestampData);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch or upload audio file");
      }
    };

    fetchResults();
  }, [currentAudioUrl, timestampResult]);

  return (
    <div className="flex flex-col space-y-4">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Results Page
      </h1>
      {currentAudioUrl ? (
        timestampResult ? (
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="w-full md:w-1/2">
                <Card>
                  <CardHeader>
                    <CardTitle>Ratio View</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResultsRatio timestampResult={timestampResult} />
                  </CardContent>
                </Card>
              </div>

              <div className="w-full md:w-1/2 min-h-[300px]">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Summary View</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResultsSummary timestampResult={timestampResult} />
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Timestamp Result</CardTitle>
              </CardHeader>
              <CardContent>
                <TimestampChart
                  audioUrl={URL.createObjectURL(audioFile)}
                  regionsData={timestampResult}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Table View</CardTitle>
              </CardHeader>
              <CardContent>
                <ResultsTable timestampResult={timestampResult} />
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                onClick={() => setIsPatientDialogOpen(true)}
                disabled={isSaving}
                className={isSaving ? "opacity-50 cursor-not-allowed" : ""}
              >
                {isSaving ? "Saving..." : "Save Results to Database"}
              </Button>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Results Saved</DialogTitle>
                  <DialogDescription>
                    The results have been successfully saved to the database.
                    Your Results ID is: {resultsId}
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>

            <Dialog
              open={isPatientDialogOpen}
              onOpenChange={setIsPatientDialogOpen}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Enter Patient Details</DialogTitle>
                  <DialogDescription>
                    Please provide the necessary information before saving the
                    results.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-2">
                  <Input ref={patientNameRef} placeholder="Patient Name" />
                  <Input ref={ageRef} placeholder="Age" />
                  <Input
                    ref={contactDetailsRef}
                    placeholder="Contact Details"
                  />
                  <Input ref={addressRef} placeholder="Address" />
                  <Input ref={citizenshipRef} placeholder="Citizenship" />
                  <Input ref={civilStatusRef} placeholder="Civil Status" />
                </div>
                <div className="flex justify-end mt-4">
                  <Button onClick={saveResultsToDatabase}>Submit</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <p>Generating Results...</p>
          // <SkeletonResults />
        )
      ) : (
        // <p>{error || "No audio file selected"}</p>
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle>Ready to Begin?</AlertTitle>
          <AlertDescription>
            To start seeing results, simply provide your input or audio command.
            Let's get going!
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
