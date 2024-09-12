// respec-app\app\results\page.tsx

"use client";

import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useResultsContext } from "@/components/results-context";
import { useAudioContext } from "@/components/audio-context";

import DiagnoseChart from "@/components/diagnose-chart";
import TimestampChart from "@/components/timestamp-chart";

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
        return;
      }

      try {
        const response = await fetch(currentAudio);
        const blob = await response.blob();

        const fileName = currentAudio.split("/").pop() || "audiofile";
        const fileType = blob.type || "audio/mpeg";
        const file = new File([blob], fileName, { type: fileType });

        setAudioFile(file);

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
  }, [currentAudio, diagnoseResult, timestampResult, setDiagnoseResult, setTimestampResult, setAudioFile]);

  return (
    <div>
      <h1>Results Page</h1>
      {currentAudio ? (
        <>
          <div className="flex flex-col space-y-4">
            {diagnoseResult ? (
              <Card>
                <CardHeader>
                  <CardTitle>Diagnosis Result</CardTitle>
                </CardHeader>
                <pre>{JSON.stringify(diagnoseResult, null, 2)}</pre>
                <DiagnoseChart data={diagnoseResult} />
              </Card>
            ) : (
              <p>Loading diagnosis results</p>
            )}

            {timestampResult && audioFile ? (
              <Card>
                <CardHeader>
                  <CardTitle>Timestamp Result</CardTitle>
                </CardHeader>
                <pre>{JSON.stringify(timestampResult, null, 2)}</pre>
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
