// respec-app\components\expanded-history.tsx

"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import ResultsRatio from "@/components/results-ratio";
import ResultsSummary from "@/components/results-summary";
import ResultsTable from "@/components/results-table";

interface TimestampResult {
  id: string;
  results: object | null;
  created_at: Date;
  patient_name: string;
  age: number;
  contact_details: string;
  address: string;
  citizenship: string;
  civil_status: string;
}

interface ExpandedHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  result: TimestampResult | null;
}

export function ExpandedHistory({
  isOpen,
  onClose,
  result,
}: ExpandedHistoryProps) {
  if (!isOpen || !result) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="w-[80vw] max-w-[90%] max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle>Details</DialogTitle>
          <DialogDescription>
            Here are the details of the selected row:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-4">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            {result.patient_name}
          </h2>
          <div className="flex items-center space-x-2">
            <small className="text-sm font-medium leading-none">ID:</small>
            <small className="text-sm font-medium leading-none text-muted-foreground">
              {result.id}
            </small>
          </div>
          <div className="flex items-center space-x-2">
            <small className="text-sm font-medium leading-none">
              Patient Name:
            </small>
            <small className="text-sm font-medium leading-none text-muted-foreground">
              {result.patient_name}
            </small>
          </div>
          <div className="flex items-center space-x-2">
            <small className="text-sm font-medium leading-none">Age:</small>
            <small className="text-sm font-medium leading-none text-muted-foreground">
              {result.age}
            </small>
          </div>
          <div className="flex items-center space-x-2">
            <small className="text-sm font-medium leading-none">
              Contact Details:
            </small>
            <small className="text-sm font-medium leading-none text-muted-foreground">
              {result.contact_details}
            </small>
          </div>
          <div className="flex items-center space-x-2">
            <small className="text-sm font-medium leading-none">Address:</small>
            <small className="text-sm font-medium leading-none text-muted-foreground">
              {result.address}
            </small>
          </div>
          <div className="flex items-center space-x-2">
            <small className="text-sm font-medium leading-none">
              Citizenship:
            </small>
            <small className="text-sm font-medium leading-none text-muted-foreground">
              {result.citizenship}
            </small>
          </div>
          <div className="flex items-center space-x-2">
            <small className="text-sm font-medium leading-none">
              Civil Status:
            </small>
            <small className="text-sm font-medium leading-none text-muted-foreground">
              {result.civil_status}
            </small>
          </div>
          <div className="flex items-center space-x-2">
            <small className="text-sm font-medium leading-none">
              Time & Date:
            </small>
            <small className="text-sm font-medium leading-none text-muted-foreground">
              {new Date(result.created_at).toLocaleDateString()}{" "}
            </small>
            <small className="text-sm font-medium leading-none text-muted-foreground">
              {new Date(result.created_at).toLocaleTimeString()}{" "}
            </small>
          </div>
        </div>

        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="w-full md:w-1/2">
            <Card>
              <CardHeader>
                <CardTitle>Ratio View</CardTitle>
              </CardHeader>
              <CardContent>
                <ResultsRatio timestampResult={result.results} />
              </CardContent>
            </Card>
          </div>

          <div className="w-full md:w-1/2 min-h-[300px]">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Summary View</CardTitle>
              </CardHeader>
              <CardContent>
                <ResultsSummary timestampResult={result.results} />
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Table View</CardTitle>
          </CardHeader>
          <CardContent>
            <ResultsTable timestampResult={result.results} />
          </CardContent>
        </Card>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
