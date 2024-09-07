// respec-app/app/results/page.tsx

"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [audioSrc, setAudioSrc] = useState<string | null>(null);

  useEffect(() => {
    const audioParam = searchParams.get('audio');
    if (audioParam) {
      setAudioSrc(decodeURIComponent(audioParam));
    }
  }, [searchParams]);

  if (!audioSrc) {
    return <div>No audio file selected.</div>;
  }

  return (
    <div>
      <h1>Results</h1>
      <audio controls src={audioSrc}>
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}
