// respec-app\components\audio-input.tsx

"use client";

import { useState, useEffect, useRef } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronRight, Play, Pause, Rewind, FastForward } from "lucide-react";

import WaveSurfer from "wavesurfer.js";
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline.esm.js";
import Minimap from "wavesurfer.js/dist/plugins/minimap.esm.js";
import Hover from "wavesurfer.js/dist/plugins/hover.esm.js";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import useAudioStore from "@/components/store/audio-store";
import useResultsStore from "@/components/store/results-store";

import { useRouter } from "next/navigation";

export default function AudioInput() {
  const router = useRouter();

  const { audioSrc, setAudioSrc, setCurrentAudio } = useAudioStore();
  const { setTimestampResult, setAudioFile } = useResultsStore();

  const [isPlaying, setIsPlaying] = useState(false);
  const [isWaveSurferReady, setIsWaveSurferReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

      // Reset states before loading the new audio
      setIsWaveSurferReady(false);
      setIsLoading(true);

      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: `rgb(102, 204, 153)`,
        progressColor: `rgb(64, 151, 112)`,
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

      // Track the loading state
      wavesurferRef.current.on("loading", (percent) => {
        console.log("Loading", percent + "%");
        if (percent === 100) {
          setIsLoading(false); // Audio is fully loaded
        }
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
        setIsLoading(false); // Ensure loading is false after ready
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
      // setAudioFile(file);
      // console.log("Audio source set:", audioUrl);
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
      setTimestampResult(null);

      router.push("/results");
    }
  };

  return (
    <div>
      <h1>Audio Input</h1>
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

        <div className="mt-4 h-[10.5rem]">
          {audioSrc ? (
            <div ref={waveformRef} id="waveform"></div>
          ) : (
            <Card className="flex items-center justify-center h-[10.5rem]">
              <h2 className="text-center">Please upload an audio file.</h2>
            </Card>
          )}
        </div>

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
        </div>
      </div>
    </div>
  );
}
