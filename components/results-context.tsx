// respec-app\components\results-context.tsx

"use client";

import { createContext, useContext, useState } from "react";

// Create a context to store diagnoseResult, timestampResult, and audioFile.
const ResultsContext = createContext<any>(null);

export const useResultsContext = () => useContext(ResultsContext);

export const ResultsProvider = ({ children }: any) => {
  const [diagnoseResult, setDiagnoseResult] = useState<object | null>(null);
  const [timestampResult, setTimestampResult] = useState<object | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);

  return (
    <ResultsContext.Provider
      value={{
        diagnoseResult,
        timestampResult,
        audioFile,
        setDiagnoseResult,
        setTimestampResult,
        setAudioFile,
      }}
    >
      {children}
    </ResultsContext.Provider>
  );
};
