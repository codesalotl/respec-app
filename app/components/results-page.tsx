// respec-app\app\components\results-page.tsx

"use client";

import React, { useState } from 'react';

export default function ResultsPage() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [diagnosisResult, setDiagnosisResult] = useState<any>(null);
  const [timestampResult, setTimestampResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseURL = 'https://cea4-103-41-9-30.ngrok-free.app';

  const handleAudioUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
      setLoading(true);
      setError(null);

      try {
        // Create a FormData object to send the file
        const formData = new FormData();
        formData.append('file', file);

        // Perform both API calls simultaneously
        const [diagnoseResponse, timestampResponse] = await Promise.all([
          fetch(`${baseURL}/diagnose`, {
            method: 'POST',
            body: formData,
          }),
          fetch(`${baseURL}/timestamp`, {
            method: 'POST',
            body: formData,
          }),
        ]);

        if (!diagnoseResponse.ok || !timestampResponse.ok) {
          throw new Error('Error with one or both API calls');
        }

        const diagnoseData = await diagnoseResponse.json();
        const timestampData = await timestampResponse.json();

        // Set the results
        setDiagnosisResult(diagnoseData);
        setTimestampResult(timestampData);

      } catch (err: any) {
        console.error('Error:', err);
        setError('Failed to get results. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      console.error('Please upload a valid audio file.');
      setError('Please upload a valid audio file.');
    }
  };

  return (
    <div>
      <h1>Results Page</h1>
      <input 
        type="file" 
        accept="audio/*" 
        onChange={handleAudioUpload} 
      />
      {audioFile && (
        <div>
          <p>Selected audio file: {audioFile.name}</p>
          <audio controls>
            <source src={URL.createObjectURL(audioFile)} type={audioFile.type} />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {diagnosisResult && (
        <div>
          <h2>Diagnosis Result</h2>
          <pre>{JSON.stringify(diagnosisResult, null, 2)}</pre>
        </div>
      )}
      {timestampResult && (
        <div>
          <h2>Timestamp Result</h2>
          <pre>{JSON.stringify(timestampResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
