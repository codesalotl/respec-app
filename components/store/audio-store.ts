import { create } from 'zustand';

interface AudioState {
  audioSrc: string | null;
  setAudioSrc: (src: string | null) => void;
  currentAudio: string | null;
  setCurrentAudio: (audio: string | null) => void;
}

const useAudioStore = create<AudioState>((set) => ({
  audioSrc: null,
  setAudioSrc: (src) => set({ audioSrc: src }),
  currentAudio: null,
  setCurrentAudio: (audio) => set({ currentAudio: audio }),
}));

export default useAudioStore;
