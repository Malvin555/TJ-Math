import type { GameResult } from "@/lib/types";
import { formatTime } from "@/lib/math-utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface HistoryTableProps {
  history: GameResult[];
}

export function HistoryTable({ history }: HistoryTableProps) {
  return (
    <div className="max-h-80 overflow-auto rounded-lg border border-border shadow-sm">
      <Table>
        <TableHeader className="sticky top-0 bg-muted">
          <TableRow>
            <TableHead className="w-[100px] text-muted-foreground">
              Date
            </TableHead>
            <TableHead className="text-muted-foreground">Score</TableHead>
            <TableHead className="text-muted-foreground">Time</TableHead>
            <TableHead className="text-muted-foreground">Operations</TableHead>
            <TableHead className="text-muted-foreground">Difficulty</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((result) => (
            <TableRow key={result.id} className="hover:bg-accent">
              <TableCell className="font-medium text-foreground">
                {new Date(result.date).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {result.score}/{result.totalQuestions}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatTime(result.timeTaken * 1000)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {Object.entries(result.settings.operations)
                  .filter(([, value]) => value)
                  .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1))
                  .join(", ")}
              </TableCell>
              <TableCell className="capitalize text-muted-foreground">
                {result.settings.difficulty}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
