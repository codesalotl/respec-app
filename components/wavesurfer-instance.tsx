import { useEffect, useMemo, useRef } from "react";

import { useWavesurfer } from "@wavesurfer/react";
import Timeline from "wavesurfer.js/dist/plugins/timeline.esm.js";
import Minimap from "wavesurfer.js/dist/plugins/minimap.esm.js";
import Hover from "wavesurfer.js/dist/plugins/hover.esm.js";

import useAudioStore from "@/components/store/audio-store";

interface WavesurferOneProps {
  isPlaying: boolean;
}

export function WavesurferOne({ isPlaying }: WavesurferOneProps) {
  const { audioUrl } = useAudioStore(); // Assuming audioUrl is a single string, not an array

  const containerRef = useRef<HTMLDivElement | null>(null);

  const { wavesurfer } = useWavesurfer({
    container: containerRef,
    waveColor: "rgb(102, 204, 153)",
    progressColor: "rgb(64, 151, 112)",
    barWidth: 5,
    barGap: 5,
    barRadius: 30,
    dragToSeek: true,
    hideScrollbar: true,
    url: audioUrl || undefined, // Use the single audio URL directly
    plugins: useMemo(
      () => [
        Timeline.create(),
        Minimap.create({
          height: 20,
          waveColor: "#ddd",
          progressColor: "#999",
        }),
        Hover.create({
          lineColor: "#ff0000",
          lineWidth: 2,
          labelBackground: "#555",
          labelColor: "#fff",
          labelSize: "11px",
        }),
      ],
      []
    ),
  });

  useEffect(() => {
    if (wavesurfer) {
      // Log the interaction with the waveform (clicks or drags)
      const handleInteraction = () => {
        // Automatically play when the user interacts
        if (!wavesurfer.isPlaying()) {
          wavesurfer.play();
        }

        if (isPlaying) {
          wavesurfer.play(); // Play if isPlaying is true
        } else {
          wavesurfer.pause(); // Pause if isPlaying is false
        }
      };

      // Listen to 'interaction' events
      wavesurfer.on("interaction", handleInteraction);

      // Cleanup listeners when component unmounts or wavesurfer changes
      return () => {
        wavesurfer.un("interaction", handleInteraction);
      };
    }
  }, [wavesurfer, isPlaying]);

  return (
    <>
      <div ref={containerRef} />
      <p>{isPlaying}</p>
      <p>{isPlaying ? "Audio is playing" : "Audio is paused"}</p>
    </>
  );
}

export function WavesurferTwo() {}
