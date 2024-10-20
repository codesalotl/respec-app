// respec-app\components\store\results-store.ts

"use client";

import { create } from 'zustand';

interface ResultsState {
  currentAudioUrl: string | null;
  setCurrentAudioUrl: (audio: string | null) => void;
  audioFile: File | null;
  setAudioFile: (file: File | null) => void;
  timestampResult: object | null;
  setTimestampResult: (result: object | null) => void;
}

const useResultsStore = create<ResultsState>((set) => ({
  currentAudioUrl: null,
  setCurrentAudioUrl: (audio) => set({ currentAudioUrl: audio }),
  audioFile: null,
  setAudioFile: (file) => set({ audioFile: file }),
  timestampResult: null,
  setTimestampResult: (result) => set({ timestampResult: result })
}));

export default useResultsStore;
