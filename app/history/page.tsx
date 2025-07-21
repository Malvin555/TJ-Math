"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HistoryTable } from "@/components/history-table";
import type { GameResult } from "@/lib/types";
import { motion } from "framer-motion";

export default function HistoryPage() {
  const [history, setHistory] = useState<GameResult[]>([]);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem("tjMathHubHistory");
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to load history from localStorage:", error);
    }
  }, []);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-gradient-to-br from-background to-muted py-12 px-4 md:px-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-4xl font-extrabold tracking-tight text-foreground drop-shadow-sm sm:text-5xl md:text-6xl text-center"
      >
        Your Quiz History
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="w-full max-w-3xl"
      >
        <Card className="rounded-xl border-2 border-border bg-card p-6 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold text-foreground">
              Past Games
            </CardTitle>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <p className="text-center text-muted-foreground">
                No history yet. Play a game to see your results here!
              </p>
            ) : (
              <HistoryTable history={history} />
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
