import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { ArrowBigRight, Stethoscope, FileInput, ChartPie } from "lucide-react";

export default function FrontPage() {
  return (
    <div>
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>Welcome to ResSpec!</AlertTitle>
        <AlertDescription>
          Begin by recording respiratory sounds using a digital stethoscope or
          uploading an existing audio file. Our advanced tools will assist you
          in analyzing the data and generating comprehensive results.
        </AlertDescription>
      </Alert>

      <div className="flex items-center justify-center space-x-8 py-10">
        {/* Card 1: Stethoscope */}
        <Card className="w-[22rem] h-[26rem] text-center flex flex-col justify-between">
          <CardHeader>
            <Stethoscope
              className="mx-auto"
              size={250}
              style={{ color: "hsl(var(--chart-6))" }}
            />
          </CardHeader>
          <CardContent>
            <CardTitle className="scroll-m-20 text-2xl font-semibold tracking-tight">
              Step 1
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Record the respiratory sound.
            </CardDescription>
          </CardContent>
        </Card>

        {/* Arrow */}
        <ArrowBigRight className="text-gray-700" size={70} />

        {/* Card 2: FileInput */}
        <Card className="w-[22rem] h-[26rem] text-center flex flex-col justify-between">
          <CardHeader>
            <FileInput
              className="mx-auto"
              size={250}
              style={{ color: "hsl(var(--chart-6))" }}
            />
          </CardHeader>
          <CardContent>
            <CardTitle className="scroll-m-20 text-2xl font-semibold tracking-tight">
              Step 2
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Input the audio file into the application.
            </CardDescription>
          </CardContent>
        </Card>

        {/* Arrow */}
        <ArrowBigRight className="text-gray-700" size={70} />

        {/* Card 3: ChartPie */}
        <Card className="w-[22srem] h-[26rem] text-center flex flex-col justify-between">
          <CardHeader>
            <ChartPie
              className="mx-auto"
              size={250}
              style={{ color: "hsl(var(--chart-6))" }}
            />
          </CardHeader>
          <CardContent>
            <CardTitle className="scroll-m-20 text-2xl font-semibold tracking-tight">
              Step 3
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              View the results and analysis of the sound.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
