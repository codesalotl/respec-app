// respec-app\app\page.tsx

"use client";

import { useState } from "react";

export default function Home() {
  const [audioSrc, setAudioSrc] = useState<string | null>(null);

  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const audioURL = URL.createObjectURL(file);
      setAudioSrc(audioURL);
    }
  };

  return (
    <main>
      <h1>Hello World</h1>

      <div>
        <label htmlFor="audio-upload">Upload an audio file:</label>
        <input
          id="audio-upload"
          type="file"
          accept="audio/*"
          onChange={handleAudioUpload}
        />
      </div>

      {audioSrc && (
        <div>
          <h2>Audio Preview:</h2>
          <audio controls src={audioSrc}></audio>
        </div>
      )}
    </main>
  );
}
