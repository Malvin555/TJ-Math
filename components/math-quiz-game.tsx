"use client";

import type React from "react";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type {
  Question,
  GameSettings,
  GameResult,
  Operation,
  Difficulty,
} from "@/lib/types";
import { generateQuestion, formatTime } from "@/lib/math-utils";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Settings, Play, BarChart3 } from "lucide-react";
import { HistoryTable } from "./history-table";

export default function MathQuizGame() {
  const [gamePhase, setGamePhase] = useState<
    "settings" | "countdown" | "playing" | "results"
  >("settings");
  const [settings, setSettings] = useState<GameSettings>({
    questionAmount: 10,
    operations: { add: true, subtract: false, multiply: false, divide: false },
    difficulty: "easy",
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [timer, setTimer] = useState(0); // in milliseconds
  const [quizStartTime, setQuizStartTime] = useState<number | null>(null);
  const [quizEndTime, setQuizEndTime] = useState<number | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [answerFeedback, setAnswerFeedback] = useState<
    "correct" | "incorrect" | null
  >(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [history, setHistory] = useState<GameResult[]>([]);

  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const feedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Load history from localStorage on component mount
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

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("tjMathHubHistory", JSON.stringify(history));
    } catch (error) {
      console.error("Failed to save history to localStorage:", error);
    }
  }, [history]);

  // Timer logic
  useEffect(() => {
    if (
      gamePhase === "playing" &&
      quizStartTime !== null &&
      quizEndTime === null
    ) {
      timerIntervalRef.current = setInterval(() => {
        setTimer(Date.now() - quizStartTime);
      }, 10); // Update every 10ms for milliseconds display
    } else if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [gamePhase, quizStartTime, quizEndTime]);

  const handleStartGame = useCallback((newSettings: GameSettings) => {
    setSettings(newSettings);
    const selectedOperations = Object.keys(newSettings.operations).filter(
      (op) => newSettings.operations[op as keyof typeof newSettings.operations],
    ) as Operation[];

    if (selectedOperations.length === 0) {
      alert("Please select at least one operation!");
      return;
    }

    const newQuestions: Question[] = Array.from({
      length: newSettings.questionAmount,
    }).map(() => {
      const randomOp =
        selectedOperations[
          Math.floor(Math.random() * selectedOperations.length)
        ];
      return generateQuestion(randomOp, newSettings.difficulty);
    });

    setQuestions(newQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setCorrectAnswers(0);
    setIncorrectAnswers(0);
    setTimer(0);
    setQuizStartTime(null); // Will be set after countdown
    setQuizEndTime(null);
    setUserAnswer("");
    setAnswerFeedback(null);
    setShowCorrectAnswer(false);
    setGamePhase("countdown");
  }, []);

  const handleCountdownEnd = useCallback(() => {
    setQuizStartTime(Date.now());
    setGamePhase("playing");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleAnswerSubmit = useCallback(() => {
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect =
      Number.parseInt(userAnswer, 10) === currentQuestion.answer;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setCorrectAnswers((prev) => prev + 1);
      setAnswerFeedback("correct");
      setShowCorrectAnswer(false);
    } else {
      setIncorrectAnswers((prev) => prev + 1);
      setAnswerFeedback("incorrect");
      setShowCorrectAnswer(true);
    }

    setUserAnswer(""); // Clear input for next question

    feedbackTimeoutRef.current = setTimeout(() => {
      setAnswerFeedback(null);
      setShowCorrectAnswer(false);
      const nextIndex = currentQuestionIndex + 1;
      if (nextIndex < questions.length) {
        setCurrentQuestionIndex(nextIndex);
        if (inputRef.current) {
          inputRef.current.focus();
        }
      } else {
        // End of quiz
        const end = Date.now();
        setQuizEndTime(end);
        const finalTimeTaken = Math.floor(
          (end - (quizStartTime || end)) / 1000,
        ); // Store in seconds

        setHistory((prevHistory) => [
          {
            id: crypto.randomUUID(),
            score: score + (isCorrect ? 1 : 0), // Final score including current question
            totalQuestions: questions.length,
            timeTaken: finalTimeTaken,
            date: new Date().toLocaleString(),
            settings,
            correctAnswers: correctAnswers + (isCorrect ? 1 : 0),
            incorrectAnswers: incorrectAnswers + (isCorrect ? 0 : 1),
          },
          ...prevHistory,
        ]);
        setGamePhase("results");
      }
    }, 700); // Show feedback for 0.7 seconds
  }, [
    currentQuestionIndex,
    questions,
    userAnswer,
    score,
    quizStartTime,
    settings,
    correctAnswers,
    incorrectAnswers,
  ]);

  const handlePlayAgain = useCallback(() => {
    setGamePhase("settings");
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setCorrectAnswers(0);
    setIncorrectAnswers(0);
    setTimer(0);
    setQuizStartTime(null);
    setQuizEndTime(null);
    setUserAnswer("");
    setAnswerFeedback(null);
    setShowCorrectAnswer(false);
  }, []);

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Card className="w-full max-w-md rounded-xl border-2 border-border bg-card p-6 shadow-xl">
      <AnimatePresence mode="wait">
        {gamePhase === "settings" && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <SettingsForm
              initialSettings={settings}
              onStartGame={handleStartGame}
            />
          </motion.div>
        )}

        {gamePhase === "countdown" && (
          <motion.div
            key="countdown"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <GameCountdown onCountdownEnd={handleCountdownEnd} />
          </motion.div>
        )}

        {gamePhase === "playing" && (
          <motion.div
            key="playing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <GamePlayArea
              question={currentQuestion?.question || ""}
              timer={timer}
              currentQuestionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              userAnswer={userAnswer}
              setUserAnswer={setUserAnswer}
              onAnswerSubmit={handleAnswerSubmit}
              answerFeedback={answerFeedback}
              showCorrectAnswer={showCorrectAnswer}
              correctAnswer={currentQuestion?.answer}
              inputRef={inputRef}
            />
          </motion.div>
        )}

        {gamePhase === "results" && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <GameResults
              score={score}
              totalQuestions={questions.length}
              timeTaken={timer}
              correctAnswers={correctAnswers}
              incorrectAnswers={incorrectAnswers}
              history={history}
              onPlayAgain={handlePlayAgain}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

interface SettingsFormProps {
  initialSettings: GameSettings;
  onStartGame: (settings: GameSettings) => void;
}

function SettingsForm({ initialSettings, onStartGame }: SettingsFormProps) {
  const [questionAmount, setQuestionAmount] = useState(
    initialSettings.questionAmount,
  );
  const [operations, setOperations] = useState(initialSettings.operations);
  const [difficulty, setDifficulty] = useState<Difficulty>(
    initialSettings.difficulty,
  );
  const [activeTab, setActiveTab] = useState("general");

  const handleOperationChange = (op: Operation, checked: boolean) => {
    setOperations((prev) => ({ ...prev, [op]: checked }));
  };

  const handlePreset = (
    amount: number,
    ops: Partial<typeof operations>,
    diff: Difficulty,
  ) => {
    setQuestionAmount(amount);
    setOperations((prev) => ({ ...prev, ...ops }));
    setDifficulty(diff);
    setActiveTab("general"); // Go back to general tab after applying preset
  };

  const isAnyOperationSelected = Object.values(operations).some((op) => op);

  return (
    <>
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-foreground">
          Quiz Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 rounded-lg bg-muted p-1">
            <TabsTrigger
              value="general"
              className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
            >
              <Settings className="mr-2 h-4 w-4" /> General
            </TabsTrigger>
            <TabsTrigger
              value="operations"
              className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
            >
              <Play className="mr-2 h-4 w-4" /> Operations
            </TabsTrigger>
            <TabsTrigger
              value="presets"
              className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
            >
              <BarChart3 className="mr-2 h-4 w-4" /> Presets
            </TabsTrigger>
          </TabsList>
          <TabsContent value="general" className="mt-4 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid gap-2">
                <Label htmlFor="question-amount" className="text-foreground">
                  Question Amount
                </Label>
                <Input
                  id="question-amount"
                  type="number"
                  min="1"
                  max="100"
                  value={questionAmount}
                  onChange={(e) =>
                    setQuestionAmount(Number.parseInt(e.target.value) || 1)
                  }
                  className="rounded-md border-input focus:border-primary focus:ring-primary"
                />
              </div>
              <div className="grid gap-4 pt-6">
                <Label className="text-foreground">Difficulty</Label>
                <RadioGroup
                  value={difficulty}
                  onValueChange={(value: Difficulty) => setDifficulty(value)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="easy"
                      id="easy"
                      className="border-primary data-[state=checked]:border-primary data-[state=checked]:text-primary"
                    />
                    <Label htmlFor="easy">Easy</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="medium"
                      id="medium"
                      className="border-primary data-[state=checked]:border-primary data-[state=checked]:text-primary"
                    />
                    <Label htmlFor="medium">Medium</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="hard"
                      id="hard"
                      className="border-primary data-[state=checked]:border-primary data-[state=checked]:text-primary"
                    />
                    <Label htmlFor="hard">Hard</Label>
                  </div>
                </RadioGroup>
              </div>
            </motion.div>
          </TabsContent>
          <TabsContent value="operations" className="mt-4 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Label className="text-foreground">Select Operations</Label>
              <div className="grid grid-cols-2 gap-3 pt-2">
                {(["add", "subtract", "multiply", "divide"] as Operation[]).map(
                  (op) => (
                    <div key={op} className="flex items-center space-x-2">
                      <Checkbox
                        id={op}
                        checked={operations[op]}
                        onCheckedChange={(checked) =>
                          handleOperationChange(op, Boolean(checked))
                        }
                        className="rounded-sm border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                      />
                      <Label
                        htmlFor={op}
                        className="capitalize text-foreground"
                      >
                        {op}
                      </Label>
                    </div>
                  ),
                )}
              </div>
            </motion.div>
          </TabsContent>
          <TabsContent value="presets" className="mt-4 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Label className="text-foreground">Quick Start Presets</Label>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    handlePreset(
                      25,
                      {
                        add: true,
                        subtract: false,
                        multiply: false,
                        divide: false,
                      },
                      "easy",
                    )
                  }
                  className="rounded-md border-input text-primary hover:bg-accent hover:text-accent-foreground"
                >
                  Add (E) 25
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    handlePreset(
                      25,
                      {
                        add: false,
                        subtract: true,
                        multiply: false,
                        divide: false,
                      },
                      "easy",
                    )
                  }
                  className="rounded-md border-input text-primary hover:bg-accent hover:text-accent-foreground"
                >
                  Sub (E) 25
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    handlePreset(
                      10,
                      {
                        add: false,
                        subtract: false,
                        multiply: true,
                        divide: false,
                      },
                      "medium",
                    )
                  }
                  className="rounded-md border-input text-primary hover:bg-accent hover:text-accent-foreground"
                >
                  Mult (M) 10
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    handlePreset(
                      10,
                      {
                        add: false,
                        subtract: false,
                        multiply: false,
                        divide: true,
                      },
                      "medium",
                    )
                  }
                  className="rounded-md border-input text-primary hover:bg-accent hover:text-accent-foreground"
                >
                  Div (M) 10
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    handlePreset(
                      50,
                      {
                        add: true,
                        subtract: true,
                        multiply: true,
                        divide: true,
                      },
                      "hard",
                    )
                  }
                  className="col-span-2 rounded-md border-input text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  All Operations (H) 50
                </Button>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>

        <Button
          onClick={() =>
            onStartGame({ questionAmount, operations, difficulty })
          }
          disabled={!isAnyOperationSelected || questionAmount < 1}
          className="mt-4 h-12 w-full rounded-md bg-primary text-lg font-semibold text-primary-foreground shadow-md transition-all duration-300 hover:bg-primary/90 hover:scale-[1.01] active:scale-[0.99]"
        >
          Start Quiz
        </Button>
      </CardContent>
    </>
  );
}

interface GameCountdownProps {
  onCountdownEnd: () => void;
}

function GameCountdown({ onCountdownEnd }: GameCountdownProps) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(onCountdownEnd, 1000); // "Go!" for 1 second
      return () => clearTimeout(timer);
    }
  }, [count, onCountdownEnd]);

  return (
    <CardContent className="flex h-64 flex-col items-center justify-center gap-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={count}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-8xl font-extrabold text-primary"
        >
          {count > 0 ? count : "Go!"}
        </motion.div>
      </AnimatePresence>
    </CardContent>
  );
}

interface GamePlayAreaProps {
  question: string;
  timer: number;
  currentQuestionNumber: number;
  totalQuestions: number;
  userAnswer: string;
  setUserAnswer: (answer: string) => void;
  onAnswerSubmit: () => void;
  answerFeedback: "correct" | "incorrect" | null;
  showCorrectAnswer: boolean;
  correctAnswer: number | undefined;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

function GamePlayArea({
  question,
  timer,
  currentQuestionNumber,
  totalQuestions,
  userAnswer,
  setUserAnswer,
  onAnswerSubmit,
  answerFeedback,
  showCorrectAnswer,
  correctAnswer,
  inputRef,
}: GamePlayAreaProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onAnswerSubmit();
    }
  };

  const inputVariants = {
    initial: { borderColor: "hsl(var(--input))" },
    correct: { borderColor: "hsl(var(--primary))", x: 0 }, // Using primary for correct
    incorrect: {
      borderColor: "hsl(var(--destructive))", // Using destructive for incorrect
      x: [-5, 5, -5, 5, 0], // Shake animation
      transition: { duration: 0.3 },
    },
  };

  return (
    <>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-xl font-semibold text-foreground">
          Question {currentQuestionNumber}/{totalQuestions}
        </CardTitle>
        <div className="text-3xl font-bold tabular-nums text-primary">
          {formatTime(timer)}
        </div>
      </CardHeader>
      <CardContent className="grid gap-6">
        <motion.div
          key={question} // Key for re-animating on question change
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center text-6xl font-extrabold tracking-tight text-foreground"
        >
          {question}
        </motion.div>
        <Progress
          value={(currentQuestionNumber / totalQuestions) * 100}
          className="h-2 rounded-full bg-muted [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-primary"
        />
        <motion.div
          variants={inputVariants}
          animate={answerFeedback || "initial"}
          className="relative"
        >
          <Input
            ref={inputRef}
            type="number"
            placeholder="Your answer"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            className={cn(
              "h-14 w-full rounded-md border-2 text-center text-3xl font-semibold transition-colors duration-200",
              "border-input focus:border-primary focus:ring-primary",
              answerFeedback === "correct" && "border-primary ring-primary",
              answerFeedback === "incorrect" &&
                "border-destructive ring-destructive",
            )}
          />
          {answerFeedback && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2",
                answerFeedback === "correct"
                  ? "text-primary"
                  : "text-destructive",
              )}
            >
              {answerFeedback === "correct" ? (
                <CheckCircle2 className="h-7 w-7" />
              ) : (
                <XCircle className="h-7 w-7" />
              )}
            </motion.div>
          )}
        </motion.div>
        {showCorrectAnswer && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-lg font-medium text-destructive"
          >
            Correct answer: {correctAnswer}
          </motion.p>
        )}
        <Button
          onClick={onAnswerSubmit}
          className="h-12 w-full rounded-md bg-primary text-lg font-semibold text-primary-foreground shadow-md transition-all duration-300 hover:bg-primary/90 hover:scale-[1.01] active:scale-[0.99]"
        >
          Submit Answer
        </Button>
      </CardContent>
    </>
  );
}

interface GameResultsProps {
  score: number;
  totalQuestions: number;
  timeTaken: number;
  correctAnswers: number;
  incorrectAnswers: number;
  history: GameResult[];
  onPlayAgain: () => void;
}

function GameResults({
  score,
  totalQuestions,
  timeTaken,
  correctAnswers,
  incorrectAnswers,
  history,
  onPlayAgain,
}: GameResultsProps) {
  const accuracy =
    totalQuestions > 0
      ? ((correctAnswers / totalQuestions) * 100).toFixed(1)
      : 0;

  return (
    <>
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-foreground">
          Quiz Results
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center"
        >
          <p className="text-3xl font-extrabold text-primary">
            You scored {score} / {totalQuestions}!
          </p>
          <p className="text-xl font-semibold text-muted-foreground">
            Time: {formatTime(timeTaken * 1000)}
          </p>
          <p className="text-lg text-muted-foreground">
            Accuracy: {accuracy}% ({correctAnswers} correct, {incorrectAnswers}{" "}
            incorrect)
          </p>
        </motion.div>
        <Button
          onClick={onPlayAgain}
          className="h-12 w-full rounded-md bg-primary text-lg font-semibold text-primary-foreground shadow-md transition-all duration-300 hover:bg-primary/90 hover:scale-[1.01] active:scale-[0.99]"
        >
          Play Again
        </Button>
        <Separator className="my-2 bg-border" />
        <h3 className="text-xl font-semibold text-foreground">Game History</h3>
        {history.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No history yet. Play a game!
          </p>
        ) : (
          <HistoryTable history={history} />
        )}
      </CardContent>
    </>
  );
}
