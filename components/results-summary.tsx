import { Separator } from "@/components/ui/separator";

interface ResultsTableProps {
  timestampResult: any[];
}

export default function ResultsSummary({ timestampResult }: ResultsTableProps) {
  // Calculate the total number of segments
  const totalSegments = timestampResult.length;

  // Calculate the average confidence of crackles and wheezes
  const avgCracklesConfidence = (
    (timestampResult.reduce(
      (sum, segment) => sum + segment.crackles_confidence,
      0
    ) /
      totalSegments) *
    100
  ).toFixed(2);

  const avgWheezesConfidence = (
    (timestampResult.reduce(
      (sum, segment) => sum + segment.wheezes_confidence,
      0
    ) /
      totalSegments) *
    100
  ).toFixed(2);

  // General detection result
  let detectedCrackles = false;
  let detectedWheezes = false;

  // Check across all segments if crackles or wheezes are detected
  timestampResult.forEach((segment) => {
    if (segment.crackles) {
      detectedCrackles = true;
    }
    if (segment.wheezes) {
      detectedWheezes = true;
    }
  });

  let generalDetectionMessage = "None";
  if (detectedCrackles && detectedWheezes) {
    generalDetectionMessage = "Wheezes, Crackles";
  } else if (detectedCrackles) {
    generalDetectionMessage = "Crackles";
  } else if (detectedWheezes) {
    generalDetectionMessage = "Wheezes";
  }

  return (
    <div className="flex flex-col space-y-14 mt-4">
      {/* First 3x1 Grid */}
      <div className="grid grid-cols-[3fr_1fr_3fr] gap-4 items-center text-sm">
        <div className="flex flex-col items-center">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            {totalSegments}
          </h1>
          <p>Segments Detected</p>
        </div>

        {/* Middle column for the vertical separator */}
        <Separator orientation="vertical" className="mx-auto" />

        <div className="flex flex-col items-center">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            {generalDetectionMessage}
          </h1>
          <p>Have Been Detected</p>
        </div>
      </div>

      {/* Horizontal Separator */}
      <Separator orientation="horizontal" className="my-4" />

      {/* Second 3x1 Grid */}
      <div className="grid grid-cols-[3fr_1fr_3fr] gap-4 items-center text-sm">
        <div className="flex flex-col items-center">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            {avgCracklesConfidence}%
          </h1>
          <p>Average Crackles Confidence</p>
        </div>

        {/* Middle column for the vertical separator */}
        <Separator orientation="vertical" className="mx-auto" />

        <div className="flex flex-col items-center">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            {avgWheezesConfidence}%
          </h1>
          <p>Average Wheezes Confidence</p>
        </div>
      </div>
    </div>
  );
}
