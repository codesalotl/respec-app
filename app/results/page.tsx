// respec-app\app\results\page.tsx

"use client";

import { useAudioContext } from "@/components/audio-context";
import { useResultsContext } from "@/components/results-context";
import { useEffect, useState } from "react";

import { DiagnoseChart } from "@/components/diagnose-chart";
import { TimestampChart } from "@/components/timestamp-chart";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Results() {
  const { currentAudio } = useAudioContext();
  const {
    diagnoseResult,
    timestampResult,
    setDiagnoseResult,
    setTimestampResult,
    audioFile,
    setAudioFile,
  } = useResultsContext();

  // const [diagnoseResult, setDiagnoseResult] = useState<object | null>(null);
  // const [timestampResult, setTimestampResult] = useState<object | null>(null);
  // const [audioFile, setAudioFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    const fetchResults = async () => {
      if (!currentAudio || diagnoseResult || timestampResult) {
        return; // Skip API call if results are already present or no audio.
      }

      try {
        // Fetch the blob from the `currentAudio` URL
        const response = await fetch(currentAudio);
        const blob = await response.blob();

        // Create a File from the Blob
        const fileName = currentAudio.split("/").pop() || "audiofile";
        const fileType = blob.type || "audio/mpeg";
        const file = new File([blob], fileName, { type: fileType });

        setAudioFile(file);

        // Send the File to the `/diagnose` and `/timestamp` endpoints
        const [diagnoseData, timestampData] = await Promise.all([
          sendAudioToAPI(file, "/diagnose"),
          sendAudioToAPI(file, "/timestamp"),
        ]);

        setDiagnoseResult(diagnoseData);
        setTimestampResult(timestampData);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch or upload audio file");
      }
    };

    fetchResults();
  }, [currentAudio, diagnoseResult, timestampResult, setDiagnoseResult, setTimestampResult, setAudioFile]); // Automatically run when `currentAudio` changes

  return (
    <div>
      <h1>Results Page</h1>
      {currentAudio ? (
        <>
          {/* <audio src={currentAudio} controls /> */}
          <div className="flex flex-col space-y-4">
            {/* Diagnose Result */}
            {diagnoseResult ? (
              <Card>
                <CardHeader>
                  <CardTitle>Diagnosis Result</CardTitle>
                </CardHeader>
                <DiagnoseChart data={diagnoseResult} />
              </Card>
            ) : (
              <p>Loading diagnosis results</p>
            )}

            {/* Timestamp Result */}
            {timestampResult && audioFile ? (
              <Card>
                <CardHeader>
                  <CardTitle>Timestamp Result</CardTitle>
                </CardHeader>
                <TimestampChart
                  audioUrl={URL.createObjectURL(audioFile)}
                  regionsData={timestampResult}
                />
              </Card>
            ) : (
              <p>Loading timestamp results</p>
            )}
          </div>
        </>
      ) : (
        <p>{error}</p>
      )}
    </div>
  );
}
