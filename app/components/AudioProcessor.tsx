// respec-app\app\components\AudioProcessor.tsx

"use client";

import { useState } from 'react';
import { uploadAudioAndPredict } from '@/app/utils/diagnose';

export default function Home() {
  const [file, setFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    try {
      const result = await uploadAudioAndPredict(file);
      setPrediction(result);
      setError(null);
    } catch (err) {
      setError(err.message);
      setPrediction(null);
    }
  };

  return (
    <div>
      <h1>Audio Prediction</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="audio/*" onChange={handleFileChange} />
        <button type="submit">Predict</button>
      </form>
      {error && <p>Error: {error}</p>}
      {prediction && (
        <div>
          <h2>Predictions:</h2>
          <ul>
            {Object.entries(prediction).map(([diagnosis, probability]) => (
              <li key={diagnosis}>
                {diagnosis}: {probability.toFixed(2)}%
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}