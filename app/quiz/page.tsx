import MathQuizGame from "@/components/math-quiz-game";

export default function QuizPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-gradient-to-br from-background to-muted py-12 px-4 md:px-6">
      <h1 className="mb-8 text-4xl font-extrabold tracking-tight text-foreground drop-shadow-sm sm:text-5xl md:text-6xl text-center">
        TJMathHub Quiz
      </h1>
      <MathQuizGame />
    </div>
  );
}
