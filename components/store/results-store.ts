// respec-app\components\store\results-store.ts

"use client";

import { create } from 'zustand';

interface ResultsState {
  timestampResult: object | null;
  setTimestampResult: (result: object | null) => void;
  audioFile: File | null;
  setAudioFile: (file: File | null) => void;
}

const useResultsStore = create<ResultsState>((set) => ({
  timestampResult: null,
  setTimestampResult: (result) => set({ timestampResult: result }),
  audioFile: null,
  setAudioFile: (file) => set({ audioFile: file }),
}));

export default useResultsStore;
