// respec-app\components\store\audio-store.ts

"use client";

import { create } from 'zustand';

interface AudioState {
  audioUrl: string | null;
  setAudioUrl: (src: string | null) => void;
}

const useAudioStore = create<AudioState>((set) => ({
  audioUrl: null,
  setAudioUrl: (src) => set({ audioUrl: src }),
}));

export default useAudioStore;
