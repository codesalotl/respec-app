"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/client";
import { ExpandedHistory } from "@/components/expanded-history";
import useAuthSession from "@/hooks/useAuthSession";

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
  user_id: string;
}

export default function ResultsHistoryPage() {
  const [results, setResults] = useState<TimestampResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { session, loading: sessionLoading } = useAuthSession();
  const [selectedResult, setSelectedResult] = useState<TimestampResult | null>(
    null
  );

  useEffect(() => {
    if (sessionLoading) return;

    const fetchResults = async () => {
      if (!session?.user) {
        setError("No user session found.");
        return;
      }

      try {
        const { data: timestampData, error: timestampError } = await supabase
          .from("timestamp_results")
          .select(
            `id, results, created_at, patient_name, age, contact_details, address, citizenship, civil_status`
          )
          .eq("user_id", session.user.id);

        if (timestampError) throw new Error(timestampError.message);

        setResults(timestampData as TimestampResult[]);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    };

    fetchResults();
  }, [session, sessionLoading]);

  const handleRowClick = (result: TimestampResult) => {
    setSelectedResult(result);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedResult(null);
  };

  return (
    <div className="flex flex-col space-y-4">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        History Page
      </h1>
      {sessionLoading ? (
        <div>Loading...</div>
      ) : !session?.user ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Login Required</AlertTitle>
          <AlertDescription>
            Please log in to view your history and continue.
          </AlertDescription>
        </Alert>
      ) : error ? (
        <div>Error fetching results: {error}</div>
      ) : (
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Patient Name</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Contact Details</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Citizenship</TableHead>
                <TableHead>Civil Status</TableHead>
                <TableHead>Time & Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result) => (
                <TableRow
                  key={result.id}
                  onClick={() => handleRowClick(result)}
                  className="cursor-pointer"
                >
                  <TableCell>{result.id}</TableCell>
                  <TableCell>{result.patient_name}</TableCell>
                  <TableCell>{result.age}</TableCell>
                  <TableCell>{result.contact_details}</TableCell>
                  <TableCell>{result.address}</TableCell>
                  <TableCell>{result.citizenship}</TableCell>
                  <TableCell>{result.civil_status}</TableCell>
                  <TableCell>
                    {new Date(result.created_at).toLocaleDateString()}{" "}
                    {new Date(result.created_at).toLocaleTimeString()}{" "}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <ExpandedHistory
            isOpen={isDialogOpen}
            onClose={handleCloseDialog}
            result={selectedResult}
          />
        </div>
      )}
    </div>
  );
}
