// respec-app\components\audio-input.tsx

"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import WaveSurfer from "wavesurfer.js";
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline.esm.js";
import Minimap from "wavesurfer.js/dist/plugins/minimap.esm.js";
import Hover from "wavesurfer.js/dist/plugins/hover.esm.js";
import { getRgbFromCssVar } from "@/utils/color-conversions";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronRight, Play, Pause, Rewind, FastForward } from "lucide-react";

import useAudioStore from "@/components/store/audio-store";
import useResultsStore from "@/components/store/results-store";

export default function AudioInput() {
  const router = useRouter();

  const { audioUrl, setAudioUrl } = useAudioStore();
  const {
    currentAudioUrl,
    setCurrentAudioUrl,
    audioFile,
    setAudioFile,
    timestampResult,
    setTimestampResult,
  } = useResultsStore();

  const [isPlaying, setIsPlaying] = useState(false);
  const [isWaveSurferReady, setIsWaveSurferReady] = useState(false);

  const waveformRef1 = useRef<HTMLDivElement | null>(null);
  const wavesurferRef1 = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    // console.log("running useEffect on wavesurfer");

    if (!audioUrl || !waveformRef1.current) return;

    // console.log("passed the first check");

    if (wavesurferRef1.current) {
      wavesurferRef1.current.destroy();
    }

    wavesurferRef1.current = WaveSurfer.create({
      container: waveformRef1.current,
      waveColor: getRgbFromCssVar("--chart-5"),
      progressColor: getRgbFromCssVar("--chart-7"),
      barWidth: 5,
      barGap: 5,
      barRadius: 30,
      dragToSeek: true,
      hideScrollbar: true,
      url: audioUrl,
      minPxPerSec: 10,
      plugins: [
        TimelinePlugin.create(),
        Minimap.create({
          height: 20,
          waveColor: "#ddd",
          progressColor: "#999",
        }),
        Hover.create({
          lineColor: getRgbFromCssVar("--chart-5"),
          lineWidth: 2,
          labelBackground: getRgbFromCssVar("--chart-8"),
          labelColor: "#fff",
          labelSize: "11px",
        }),
      ],
    });

    wavesurferRef1.current.on("ready", () => {
      setIsWaveSurferReady(true);
    });

    wavesurferRef1.current.on("interaction", () => {
      wavesurferRef1.current?.play();
      setIsPlaying(true);
    });

    wavesurferRef1.current.on("play", () => {
      setIsPlaying(true);
    });

    wavesurferRef1.current.on("pause", () => {
      setIsPlaying(false);
    });

    wavesurferRef1.current.on("finish", () => {
      setIsPlaying(false);
    });

    return () => {
      if (wavesurferRef1.current) {
        wavesurferRef1.current.destroy();
        wavesurferRef1.current = null;
      }
    };
  }, [audioUrl]);

  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("audio/")) {
      const audioBlob = URL.createObjectURL(file);

      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }

      setAudioUrl(audioBlob);

      // console.log("audioBlob:", audioBlob);
      // console.log("audioUrl:", audioUrl);
      // console.log("currentAudioUrl:", currentAudioUrl);
      // console.log("audioFile:", audioFile);
      // console.log("timestampResult:", timestampResult);
    } else {
      alert("Please select a valid audio file.");
    }
  };

  const togglePlayPause = () => {
    if (wavesurferRef1.current) {
      if (isPlaying) {
        wavesurferRef1.current.pause();
      } else {
        wavesurferRef1.current.play();
      }
    }
  };

  const skip = (seconds: number) => {
    if (wavesurferRef1.current) {
      wavesurferRef1.current.skip(seconds);
    }
  };

  // useEffect(() => {
  //   console.log("after:", isPlaying);
  // }, [isPlaying]);

  const handleResultsRedirect = () => {
    // console.log("after submit - before redirect");
    // console.log("audioUrl:", audioUrl);
    // console.log("currentAudioUrl:", currentAudioUrl);
    // console.log("audioFile:", audioFile);
    // console.log("timestampResult:", timestampResult);

    setCurrentAudioUrl(audioUrl);
    setAudioFile(null);
    setTimestampResult(null);

    router.push("/results");
  };

  return (
    <div>
      <h1>Audio Input</h1>
      <div>
        <Label htmlFor="audio">Audio</Label>
        <div className="flex flex-row space-x-4">
          <Input type="file" accept="audio/*" onChange={handleAudioUpload} />
          <Button
            size="icon"
            onClick={handleResultsRedirect}
            disabled={!isWaveSurferReady}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-4 h-[10.5rem]">
          {audioUrl ? (
            <div ref={waveformRef1} id="waveform" />
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
