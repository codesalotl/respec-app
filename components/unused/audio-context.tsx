// respec-app\components\audio-context.tsx

"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface AudioContextType {
  audioSrc: string | null;
  setAudioSrc: React.Dispatch<React.SetStateAction<string | null>>;
  currentAudio: string | null;
  setCurrentAudio: React.Dispatch<React.SetStateAction<string | null>>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);

  return (
    <AudioContext.Provider
      value={{ audioSrc, setAudioSrc, currentAudio, setCurrentAudio }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudioContext = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudioContext must be used within an AudioProvider");
  }
  return context;
};
