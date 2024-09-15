// respec-app\app\results\page.tsx

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/client";
import { v4 as uuidv4 } from "uuid";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import useAudioStore from "@/components/store/audio-store";
import useResultsStore from "@/components/store/results-store";

import TimestampChart from "@/components/timestamp-chart";
import ResultsTable from "@/components/results-table";
import ResultsRatio from "@/components/results-ratio";
import ResultsSummary from "@/components/results-summary";

export default function Results() {
  const { currentAudio, setCurrentAudio } = useAudioStore();
  const { timestampResult, setTimestampResult, audioFile, setAudioFile } =
    useResultsStore();

  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [resultsId, setResultsId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const sendAudioToAPI = async (file: File, endpoint: string): Promise<any> => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`http://192.168.1.38:5000${endpoint}`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        return result;
      } else {
        throw new Error(`Failed to upload audio to ${endpoint}`);
      }
    } catch (error) {
      console.error(error);
      throw new Error(`Error uploading audio to ${endpoint}`);
    }
  };

  const saveResultsToDatabase = async () => {
    if (!timestampResult) {
      setError("No results to save.");
      return;
    }

    const uniqueId = uuidv4();
    setResultsId(uniqueId);

    setIsSaving(true);
    try {
      const { error: timestampError } = await supabase
        .from("timestamp_results")
        .insert([{ id: uniqueId, results: timestampResult }]);

      if (timestampError) {
        throw new Error("Error saving timestamp results");
      }

      setIsSaving(false);
      setIsDialogOpen(true);
    } catch (err) {
      console.error(err);
      setError("Failed to save results.");
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const fetchResults = async () => {
      if (!currentAudio || timestampResult) {
        return;
      }

      try {
        const response = await fetch(currentAudio);
        const blob = await response.blob();

        const fileName = currentAudio.split("/").pop() || "audiofile";
        const fileType = blob.type || "audio/mpeg";
        const file = new File([blob], fileName, { type: fileType });

        setAudioFile(file);

        const timestampData = await sendAudioToAPI(file, "/timestamp");

        setTimestampResult(timestampData);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch or upload audio file");
      }
    };

    fetchResults();
  }, [currentAudio, timestampResult, setTimestampResult, setAudioFile]);

  return (
    <div>
      <h1>Results Page</h1>
      {currentAudio ? (
        <>
          <div className="flex flex-col space-y-4">
            {timestampResult && audioFile ? (
              <>
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
                    {/* <pre>{JSON.stringify(timestampResult, null, 2)}</pre> */}
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
                    onClick={saveResultsToDatabase}
                    disabled={isSaving}
                    className={isSaving ? "opacity-50 cursor-not-allowed" : ""}
                  >
                    {isSaving ? "Saving..." : "Save Results to Database"}
                  </Button>
                </div>
              </>
            ) : (
              <p>Loading timestamp results</p>
            )}

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
          </div>
        </>
      ) : (
        <p>{error}</p>
      )}
    </div>
  );
}
