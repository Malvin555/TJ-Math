export type Operation = "add" | "subtract" | "multiply" | "divide";

export type Difficulty = "easy" | "medium" | "hard";

export interface Question {
  id: number;
  question: string;
  answer: number;
  operation: Operation;
  num1: number;
  num2: number;
}

export interface GameSettings {
  questionAmount: number;
  operations: {
    add: boolean;
    subtract: boolean;
    multiply: boolean;
    divide: boolean;
  };
  difficulty: Difficulty;
}

export interface GameResult {
  id: string;
  score: number;
  totalQuestions: number;
  timeTaken: number; // in seconds
  date: string;
  settings: GameSettings;
  correctAnswers: number;
  incorrectAnswers: number;
}
