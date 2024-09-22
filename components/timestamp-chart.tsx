// respec-app\components\timestamp-chart.tsx

import React, { useEffect, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline.esm.js";
import Minimap from "wavesurfer.js/dist/plugins/minimap.esm.js";
import Hover from "wavesurfer.js/dist/plugins/hover.esm.js";
import Spectrogram from "wavesurfer.js/dist/plugins/spectrogram.esm.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.esm.js";

import { Button } from "@/components/ui/button";

interface Region {
  start_time: number;
  end_time: number;
  crackles: boolean;
  crackles_confidence: number;
  wheezes: boolean;
  wheezes_confidence: number;
}

interface TimestampChartProps {
  audioUrl: string;
  regionsData: Region[];
}

// Function to combine consecutive regions with the same start_time and end_time
function combineRegions(regionsData: Region[]): Region[] {
  if (regionsData.length === 0) return [];

  const combinedRegions: Region[] = [];
  let currentRegion = { ...regionsData[0] };

  for (let i = 1; i < regionsData.length; i++) {
    const nextRegion = regionsData[i];

    // Check if the regions are consecutive and have the same start_time and end_time
    if (currentRegion.end_time === nextRegion.start_time) {
      currentRegion.end_time = nextRegion.end_time;

      if (currentRegion.crackles === nextRegion.crackles) {
        currentRegion.crackles_confidence =
          (currentRegion.crackles_confidence + nextRegion.crackles_confidence) /
          2;
        currentRegion.wheezes_confidence =
          (currentRegion.wheezes_confidence + nextRegion.wheezes_confidence) /
          2;
      }
    } else {
      combinedRegions.push(currentRegion);
      currentRegion = { ...nextRegion };
    }
  }

  // Add the last region
  combinedRegions.push(currentRegion);

  return combinedRegions;
}

export default function TimestampChart({
  audioUrl,
  regionsData,
}: TimestampChartProps) {
  const [showCrackles, setShowCrackles] = useState(true);

  // Log the regionsData to inspect its contents
  useEffect(() => {
    console.log("Regions Data:", regionsData);
  }, [regionsData]);

  // Separate and combine regions based on crackles and wheezes
  const cracklesData = regionsData.filter((region) => region.crackles);
  const wheezesData = regionsData.filter((region) => region.wheezes);
  const combinedCrackles = combineRegions(cracklesData);
  const combinedWheezes = combineRegions(wheezesData);

  useEffect(() => {
    if (!audioUrl) return;

    const regions = RegionsPlugin.create();

    // Create an instance of WaveSurfer
    const ws = WaveSurfer.create({
      container: "#waveform2",
      waveColor: `rgb(102, 204, 153)`,
      progressColor: `rgb(64, 151, 112)`,
      barWidth: 5,
      barGap: 5,
      barRadius: 30,
      dragToSeek: true,
      hideScrollbar: true,
      minPxPerSec: 10,
      url: audioUrl,
      plugins: [
        regions,
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

    // Function to create a region
    const createRegion = (
      start: number,
      end: number,
      content: string,
      color: string
    ) => {
      regions.addRegion({
        start,
        end,
        content,
        color,
        drag: false,
        resize: false,
      });
    };

    // Create regions based on the toggle state
    ws.on("decode", () => {
      const dataToShow = showCrackles ? combinedCrackles : combinedWheezes;

      dataToShow.forEach((region) => {
        const content = showCrackles
          ? `Crackles: Yes (${(
              region.crackles_confidence * 100
            ).toFixed(2)}%)`
          : `Wheezes: Yes (${(
              region.wheezes_confidence * 100
            ).toFixed(2)}%)`;

        const color = showCrackles
          ? `rgb(102, 204, 153, 0.2)`
          : `rgb(102, 204, 153, 0.2)`;

        createRegion(region.start_time, region.end_time, content, color);
      });
    });

    // Initialize the Spectrogram plugin
    ws.registerPlugin(
      Spectrogram.create({
        labels: true,
        height: 200,
        splitChannels: true,
      })
    );

    // Play on user interaction
    ws.once("interaction", () => {
      ws.play();
    });

    // Cleanup on component unmount
    return () => {
      ws.destroy();
    };
  }, [audioUrl, combinedCrackles, combinedWheezes, showCrackles]); // Re-run the effect if audioUrl, combinedCrackles, combinedWheezes, or showCrackles changes

  return (
    <div className="min-h-72">
      <div className="flex flex-col space-y-4">
        <div className="flex space-x-4">
          <Button onClick={() => setShowCrackles(true)}>Show Crackles</Button>
          <Button onClick={() => setShowCrackles(false)}>Show Wheezes</Button>
        </div>
        <div id="waveform2"></div>
      </div>
    </div>
  );
}
