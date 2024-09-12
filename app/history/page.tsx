// respec-app\app\history\page.tsx

"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/client";

export default function ResultsHistoryPage() {
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  // Fetch data from both tables and combine results
  useEffect(() => {
    const fetchResults = async () => {
      try {
        // Fetch data from diagnose_results table
        const { data: diagnoseData, error: diagnoseError } = await supabase
          .from("diagnose_results")
          .select("id, results");

        // Fetch data from timestamp_results table
        const { data: timestampData, error: timestampError } = await supabase
          .from("timestamp_results")
          .select("id, results");

        // Handle errors for both queries
        if (diagnoseError) throw new Error(diagnoseError.message);
        if (timestampError) throw new Error(timestampError.message);

        // Combine results by matching IDs
        const combinedResults = diagnoseData.map((diagnose) => {
          const timestamp = timestampData.find(
            (ts) => ts.id === diagnose.id
          );
          return {
            id: diagnose.id,
            diagnoseResults: diagnose.results,
            timestampResults: timestamp ? timestamp.results : null, // Handle cases where there might be no match
          };
        });

        setResults(combinedResults);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchResults();
  }, []);

  if (error) {
    return <div>Error fetching results: {error}</div>;
  }

  return (
    <div>
      <h1>Combined Results</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Diagnosis Results</th>
            <th>Timestamp Results</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result) => (
            <tr key={result.id}>
              <td>{result.id}</td>
              <td>
                <pre>{JSON.stringify(result.diagnoseResults, null, 2)}</pre>
              </td>
              <td>
                {result.timestampResults ? (
                  <pre>{JSON.stringify(result.timestampResults, null, 2)}</pre>
                ) : (
                  "No timestamp results"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
