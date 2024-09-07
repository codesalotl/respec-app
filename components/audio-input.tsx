// respec-app\components\audio-input.tsx

"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronRight, Play, Pause, Rewind, FastForward } from "lucide-react";
import WaveSurfer from "wavesurfer.js";
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline.esm.js";
import Minimap from "wavesurfer.js/dist/plugins/minimap.esm.js";
import Hover from "wavesurfer.js/dist/plugins/hover.esm.js";
import { ModeToggle } from "@/components/dark-mode-toggle";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { useAudioContext } from "@/components/audio-context";
import { useRouter } from "next/navigation";

export default function AudioInput() {
  const router = useRouter();
  const { audioSrc, setAudioSrc, currentAudio, setCurrentAudio } =
    useAudioContext();

  // const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isWaveSurferReady, setIsWaveSurferReady] = useState(false);

  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }
      if (audioSrc) {
        URL.revokeObjectURL(audioSrc);
      }
    };
  }, [audioSrc]);

  useEffect(() => {
    if (audioSrc && waveformRef.current) {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }

      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#4F4A85",
        progressColor: "#383351",
        barWidth: 5,
        barGap: 5,
        barRadius: 30,
        dragToSeek: true,
        hideScrollbar: true,
        url: audioSrc,
        minPxPerSec: 10,
        plugins: [
          TimelinePlugin.create(),
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
      });

      wavesurferRef.current.on("interaction", () => {
        wavesurferRef.current?.play();
        setIsPlaying(true);
      });

      wavesurferRef.current.on("play", () => {
        setIsPlaying(true);
      });

      wavesurferRef.current.on("pause", () => {
        setIsPlaying(false);
      });

      wavesurferRef.current.on("finish", () => {
        setIsPlaying(false);
      });

      wavesurferRef.current.on("ready", () => {
        console.log("WaveSurfer is ready");
        setIsWaveSurferReady(true);
      });
    }
  }, [audioSrc]);

  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("audio/")) {
      if (audioSrc) {
        URL.revokeObjectURL(audioSrc);
      }

      const audioUrl = URL.createObjectURL(file);
      setAudioSrc(audioUrl);
      setAudioFile(file);
      console.log("Audio source set:", audioUrl);
    } else {
      alert("Please select a valid audio file.");
    }
  };

  const togglePlayPause = () => {
    if (wavesurferRef.current) {
      if (isPlaying) {
        wavesurferRef.current.pause();
      } else {
        wavesurferRef.current.play();
      }
    }
  };

  const skip = (seconds: number) => {
    if (wavesurferRef.current) {
      wavesurferRef.current.skip(seconds);
    }
  };

  const handleResultsRedirect = () => {
    if (isWaveSurferReady) {
      setCurrentAudio(audioSrc);
      router.push("/results");
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full z-0 p-4">
      <h1>Audio Input</h1>
      <ModeToggle />
      <br />
      <div>
        <Label htmlFor="audio">Audio</Label>
        <div className="flex flex-row space-x-4">
          <div>
            <Input type="file" accept="audio/*" onChange={handleAudioUpload} />
          </div>
          <Button
            size="icon"
            onClick={handleResultsRedirect}
            disabled={!isWaveSurferReady}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-4" ref={waveformRef} id="waveform"></div>
        <div className="flex space-x-2 mt-4 justify-center">
          <Button onClick={() => skip(-5)} size="icon">
            <Rewind className="h-4 w-4" />
          </Button>
          <Button onClick={togglePlayPause} size="icon">
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          <Button onClick={() => skip(5)} size="icon">
            <FastForward className="h-4 w-4" />
          </Button>

          <button type="button" onClick={() => router.push("/")}>
            Home
          </button>
          <button type="button" onClick={() => router.push("/results")}>
            Results
          </button>
        </div>
      </div>
    </div>
  );
}
