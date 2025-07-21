import type { Difficulty, Operation, Question } from "./types";

const getNumberRange = (
  operation: Operation,
  difficulty: Difficulty,
): [number, number] => {
  switch (difficulty) {
    case "easy":
      if (operation === "multiply" || operation === "divide") return [1, 12];
      return [1, 20];
    case "medium":
      if (operation === "multiply" || operation === "divide") return [5, 20];
      return [10, 100];
    case "hard":
      if (operation === "multiply" || operation === "divide") return [10, 30];
      return [50, 500];
    default:
      return [1, 10]; // Default for safety
  }
};

export const generateQuestion = (
  operation: Operation,
  difficulty: Difficulty,
): Question => {
  const [min, max] = getNumberRange(operation, difficulty);
  let num1, num2, answer, questionStr;

  switch (operation) {
    case "add":
      num1 = Math.floor(Math.random() * (max - min + 1)) + min;
      num2 = Math.floor(Math.random() * (max - min + 1)) + min;
      answer = num1 + num2;
      questionStr = `${num1} + ${num2}`;
      break;
    case "subtract":
      num1 = Math.floor(Math.random() * (max - min + 1)) + min;
      num2 = Math.floor(Math.random() * num1) + 1; // Ensure num2 is smaller than num1 and not zero
      answer = num1 - num2;
      questionStr = `${num1} - ${num2}`;
      break;
    case "multiply":
      num1 = Math.floor(Math.random() * (max - min + 1)) + min;
      num2 = Math.floor(Math.random() * (max - min + 1)) + min;
      answer = num1 * num2;
      questionStr = `${num1} × ${num2}`;
      break;
    case "divide":
      num2 = Math.floor(Math.random() * (max - min + 1)) + min; // Divisor
      if (num2 === 0) num2 = 1; // Avoid division by zero
      num1 = num2 * (Math.floor(Math.random() * (max - min + 1)) + min); // Ensure num1 is a multiple of num2
      answer = num1 / num2;
      questionStr = `${num1} ÷ ${num2}`;
      break;
    default:
      throw new Error("Invalid operation");
  }

  return {
    id: Date.now() + Math.random(), // Unique ID for each question
    question: questionStr,
    answer,
    operation,
    num1,
    num2,
  };
};

export const formatTime = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const ms = Math.floor((milliseconds % 1000) / 10); // Get two digits for milliseconds

  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${ms.toString().padStart(2, "0")}`;
};
