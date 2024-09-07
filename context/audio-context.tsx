// respec-app/context/AudioContext.tsx

import React, { createContext, useState, ReactNode } from "react";

interface AudioContextProps {
  audioSrc: string | null;
  audioFile: File | null;
  setAudioSrc: (src: string | null) => void;
  setAudioFile: (file: File | null) => void;
}

export const AudioContext = createContext<AudioContextProps | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);

  return (
    <AudioContext.Provider value={{ audioSrc, audioFile, setAudioSrc, setAudioFile }}>
      {children}
    </AudioContext.Provider>
  );
}
