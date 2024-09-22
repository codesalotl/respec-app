import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ResultsTableProps {
  timestampResult: any[]; // Array of objects
}

export default function ResultsTable({ timestampResult }: ResultsTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Segment (Start - End)</TableHead>
            <TableHead>Crackles</TableHead>
            <TableHead>Crackles Confidence</TableHead>
            <TableHead>Wheezes</TableHead>
            <TableHead>Wheezes Confidence</TableHead>
            <TableHead>Wheezes & Crackles</TableHead>
            <TableHead>Avg Confidence</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {timestampResult && timestampResult.length > 0 ? (
            timestampResult.map((row, index) => {
              // Check if both crackles and wheezes are true
              let cracklesAndWheezes = row.crackles && row.wheezes;
              let averageConfidence = null;

              if (cracklesAndWheezes) {
                const cracklesConfidence = row.crackles_confidence || 0;
                const wheezesConfidence = row.wheezes_confidence || 0;
                averageConfidence =
                  ((cracklesConfidence + wheezesConfidence) / 2) * 100;
              }

              return (
                <TableRow key={index}>
                  <TableCell>
                    {row.start_time + "s"} - {row.end_time + "s"}
                  </TableCell>

                  {/* Crackles cell with color */}
                  <TableCell
                    style={{
                      color: row.crackles ? "hsl(var(--chart-5))" : "inherit",
                    }}
                  >
                    {row.crackles ? "Yes" : "No"}
                  </TableCell>

                  {/* Crackles confidence with color */}
                  <TableCell
                    style={{
                      color: row.crackles ? "hsl(var(--chart-5))" : "inherit",
                    }}
                  >
                    {(row.crackles_confidence * 100).toFixed(2)}%
                  </TableCell>

                  {/* Wheezes cell with color */}
                  <TableCell
                    style={{
                      color: row.wheezes ? "hsl(var(--chart-5))" : "inherit", // Custom color for Wheezes
                    }}
                  >
                    {row.wheezes ? "Yes" : "No"}
                  </TableCell>

                  {/* Wheezes confidence with color */}
                  <TableCell
                    style={{
                      color: row.wheezes ? "hsl(var(--chart-5))" : "inherit", // Custom color for Wheezes confidence
                    }}
                  >
                    {row.wheezes_confidence
                      ? `${(row.wheezes_confidence * 100).toFixed(2)}%`
                      : "N/A"}
                  </TableCell>

                  {/* Crackles and Wheezes cell with color */}
                  <TableCell
                    style={{
                      color: cracklesAndWheezes
                        ? "hsl(var(--chart-5))"
                        : "inherit",
                    }}
                  >
                    {cracklesAndWheezes ? "Yes" : "No"}
                  </TableCell>

                  {/* Avg Confidence for Crackles & Wheezes with color */}
                  <TableCell
                    style={{
                      color: cracklesAndWheezes
                        ? "hsl(var(--chart-5))"
                        : "inherit",
                    }}
                  >
                    {averageConfidence !== null
                      ? `${averageConfidence.toFixed(2)}%`
                      : "N/A"}
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={7}>No data available</TableCell>{" "}
              {/* Adjusted colspan */}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
