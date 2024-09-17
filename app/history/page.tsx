// respec-app\app\history\page.tsx

"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/client";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { ExpandedHistory } from "@/components/expanded-history";

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

export default function ResultsHistoryPage() {
  const [results, setResults] = useState<TimestampResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedResult, setSelectedResult] = useState<TimestampResult | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const { data: timestampData, error: timestampError } =
          await supabase.from("timestamp_results").select(`
            id,
            results,
            created_at,
            patient_name,
            age,
            contact_details,
            address,
            citizenship,
            civil_status
          `);

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
  }, []);

  const handleRowClick = (result: TimestampResult) => {
    setSelectedResult(result);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedResult(null);
  };

  if (error) {
    return <div>Error fetching results: {error}</div>;
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Timestamp Results</h1>
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
              <TableCell>{new Date(result.created_at).toLocaleDateString()}{" "} {new Date(result.created_at).toLocaleTimeString()}{" "}</TableCell>
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
  );
}
