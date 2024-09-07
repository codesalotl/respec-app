import React, { useEffect, useState } from "react";
import WaveSurfer from "wavesurfer.js";
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

export function TimestampChart({ audioUrl, regionsData }: TimestampChartProps) {
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

    function hslToRgb(hsl) {
      const [h, s, l] = hsl.match(/\d+/g).map(Number);
      const a = (s * Math.min(l, 100 - l)) / 100;
      const f = (n) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round((255 * color) / 100);
      };
      return `${f(0)}, ${f(8)}, ${f(4)}`;
    }

    const waveColorHsl = getComputedStyle(document.documentElement)
      .getPropertyValue("--chart-6")
      .trim();
    const progressColor2Hsl = getComputedStyle(document.documentElement)
      .getPropertyValue("--chart-7")
      .trim();
    const cracklesColorHs1 = getComputedStyle(document.documentElement)
      .getPropertyValue("--chart-5")
      .trim();
    const wheezesColor2Hsl = getComputedStyle(document.documentElement)
      .getPropertyValue("--chart-7")
      .trim();

    const waveColorRgb = hslToRgb(waveColorHsl);
    const progressColorRgb = hslToRgb(progressColor2Hsl);
    const cracklesColorRgb = hslToRgb(cracklesColorHs1);
    const wheezesColorRgb = hslToRgb(wheezesColor2Hsl);

    // Create an instance of WaveSurfer
    const ws = WaveSurfer.create({
      container: "#waveform2",
      waveColor: `rgb(${waveColorRgb})`,
      progressColor: `rgb(${progressColorRgb})`,
      url: audioUrl,
      plugins: [regions],
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
          ? `Crackles: Yes (Confidence: ${(
              region.crackles_confidence * 100
            ).toFixed(2)}%)`
          : `Wheezes: Yes (Confidence: ${(
              region.wheezes_confidence * 100
            ).toFixed(2)}%)`;

        const color = showCrackles
          ? `rgb(${cracklesColorRgb}, 0.5)`
          : `rgb(${cracklesColorRgb}, 0.5)`;

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
    <div className="min-h-64">
      <div className="m-6 flex space-x-4">
        <Button onClick={() => setShowCrackles(true)}>Show Crackles</Button>
        <Button onClick={() => setShowCrackles(false)}>Show Wheezes</Button>
      </div>
      <div id="waveform2"></div>
    </div>
  );
}
