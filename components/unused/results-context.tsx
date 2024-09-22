// respec-app\components\results-context.tsx

"use client";

import { createContext, useContext, useState } from "react";

const ResultsContext = createContext<any>(null);

export const useResultsContext = () => useContext(ResultsContext);

export const ResultsProvider = ({ children }: any) => {
  const [timestampResult, setTimestampResult] = useState<object | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);

  return (
    <ResultsContext.Provider
      value={{
        timestampResult,
        audioFile,
        setTimestampResult,
        setAudioFile,
      }}
    >
      {children}
    </ResultsContext.Provider>
  );
};
