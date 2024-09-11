// respec-app\components\results-page.tsx

"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ModeToggle } from "@/components/dark-mode-toggle";
import { DiagnoseChart } from "@/components/diagnose-chart";
import { TimestampChart } from "@/components/timestamp-chart";

export default function ResultsPage() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [diagnosisResult, setDiagnosisResult] = useState<any>(null);
  const [timestampResult, setTimestampResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseURL = "http://192.168.1.38:5000";

  const handleAudioUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("audio/")) {
      setAudioFile(file);
      setLoading(true);
      setError(null);

      try {
        // Create a FormData object to send the file
        const formData = new FormData();
        formData.append("file", file);

        // Perform both API calls simultaneously
        const [diagnoseResponse, timestampResponse] = await Promise.all([
          fetch(`${baseURL}/diagnose`, {
            method: "POST",
            body: formData,
          }),
          fetch(`${baseURL}/timestamp`, {
            method: "POST",
            body: formData,
          }),
        ]);

        if (!diagnoseResponse.ok || !timestampResponse.ok) {
          throw new Error("Error with one or both API calls");
        }

        const diagnoseData = await diagnoseResponse.json();
        const timestampData = await timestampResponse.json();

        // Set the results
        setDiagnosisResult(diagnoseData);
        setTimestampResult(timestampData);
      } catch (err: any) {
        console.error("Error:", err);
        setError("Failed to get results. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      console.error("Please upload a valid audio file.");
      setError("Please upload a valid audio file.");
    }
  };

  return (
    <div>
      <h1>Results Page</h1>

      <ModeToggle />

      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="audio">Audio</Label>
        <Input type="file" accept="audio/*" onChange={handleAudioUpload} />
      </div>

      {audioFile && (
        <div>
          <p>Selected audio file: {audioFile.name}</p>
          {/* <audio controls>
            <source
              src={URL.createObjectURL(audioFile)}
              type={audioFile.type}
            />
            Your browser does not support the audio element.
          </audio> */}
        </div>
      )}
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="m-8 flex flex-col space-y-4">
        {diagnosisResult && (
          <Card>
            <CardHeader>
              <CardTitle>Diagnosis Result</CardTitle>
            </CardHeader>
            {/* <pre>{JSON.stringify(diagnosisResult, null, 2)}</pre> */}
            <DiagnoseChart data={diagnosisResult} />
          </Card>
        )}
        
        {timestampResult && audioFile && (
          <Card>
            <CardHeader>
              <CardTitle>Timestamp Result</CardTitle>
            </CardHeader>
            {/* <pre>{JSON.stringify(timestampResult, null, 2)}</pre> */}
            <TimestampChart
              audioUrl={URL.createObjectURL(audioFile)}
              regionsData={timestampResult} // Pass timestampResult as regionsData
            />
          </Card>
        )}
      </div>
    </div>
  );
}
