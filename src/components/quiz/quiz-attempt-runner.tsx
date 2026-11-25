"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Quiz, SubmittedAnswer } from "@/types/database";
import {
  formatTimer,
  scoreQuizAttempt,
  QuizScoreResult,
} from "@/lib/quiz-attempt";
import { formatQuizDuration, calculateTotalMarks } from "@/lib/quiz";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Clock,
  Award,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  PlayCircle,
  RotateCcw,
  BookOpen,
  Send,
  Loader2,
  HelpCircle,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "cn";

interface QuizAttemptRunnerProps {
  quiz: Quiz;
}

type QuizStage = "intro" | "in_progress" | "results";

export function QuizAttemptRunner({ quiz }: QuizAttemptRunnerProps) {
  const router = useRouter();
  const questions = quiz.questions || [];
  const durationSeconds = quiz.duration_seconds || 600;
  const totalPossibleMarks = calculateTotalMarks(questions);

  const [stage, setStage] = useState<QuizStage>("intro");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const [timeTakenSeconds, setTimeTakenSeconds] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scoreResult, setScoreResult] = useState<QuizScoreResult | null>(null);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  // Timer interval ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Submit attempt callback
  const submitAttempt = useCallback(
    async (answersToSubmit: Record<string, string>, timeUsed: number) => {
      if (isSubmitting) return;

      try {
        setIsSubmitting(true);
        if (timerRef.current) clearInterval(timerRef.current);

        const answersList: SubmittedAnswer[] = Object.entries(answersToSubmit).map(
          ([question_id, selected_answer]) => ({
            question_id,
            selected_answer,
          })
        );

        const result = scoreQuizAttempt(questions, answersList);
        setScoreResult(result);
        setTimeTakenSeconds(timeUsed);

        // Save to Supabase quiz_attempts table
        const { error: attemptErr } = await supabase.from("quiz_attempts").insert({
          quiz_id: quiz.id,
          answers: answersList,
          score: result.score,
          total_marks: result.total_marks,
          submitted_at: new Date().toISOString(),
        });

        if (attemptErr) {
          console.error("Failed to save attempt in database:", attemptErr);
        }

        setStage("results");
        toast.success(`Quiz completed! Score: ${result.score}/${result.total_marks}`);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to submit attempt.";
        toast.error(msg);
      } finally {
        setIsSubmitting(false);
        setShowConfirmSubmit(false);
      }
    },
    [isSubmitting, questions, quiz.id]
  );

  // Countdown timer effect
  useEffect(() => {
    if (stage === "in_progress") {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            // Time expired -> auto submit!
            toast.warning("Time expired! Submitting your answers automatically.");
            submitAttempt(selectedAnswers, durationSeconds);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [stage, selectedAnswers, durationSeconds, submitAttempt]);

  const handleStartQuiz = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setTimeLeft(durationSeconds);
    setScoreResult(null);
    setStage("in_progress");
  };

  const handleRetakeQuiz = () => {
    handleStartQuiz();
  };

  const handleSelectOption = (questionId: string, option: string) => {
    if (stage !== "in_progress") return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = Object.keys(selectedAnswers).length;
  const unansweredCount = Math.max(0, questions.length - answeredCount);

  // Timer urgency style
  const getTimerStyle = () => {
    if (timeLeft <= 30) {
      return "border-red-300 bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800 animate-pulse font-bold";
    }
    if (timeLeft <= 60) {
      return "border-amber-300 bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800 font-semibold";
    }
    return "border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800 font-semibold";
  };

  // -------------------------------------------------------------
  // STAGE 1: INTRO / PRE-QUIZ SCREEN
  // -------------------------------------------------------------
  if (stage === "intro") {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Link
          href="/quizzes"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Quizzes</span>
        </Link>

        <Card className="border border-border/80 shadow-md">
          <CardHeader className="space-y-4 pb-6 border-b">
            <div className="flex items-center gap-2 flex-wrap">
              {quiz.subject && (
                <Badge variant="secondary" className="text-xs">
                  {quiz.subject}
                </Badge>
              )}
              <Badge variant="outline" className="text-xs gap-1">
                <Clock className="size-3" />
                <span>{formatQuizDuration(durationSeconds)}</span>
              </Badge>
              <Badge variant="outline" className="text-xs gap-1">
                <Award className="size-3" />
                <span>{totalPossibleMarks} Marks</span>
              </Badge>
            </div>

            <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
              {quiz.title}
            </CardTitle>

            {quiz.description && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {quiz.description}
              </p>
            )}
          </CardHeader>

          <CardContent className="py-6 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Test Instructions:
            </h4>
            <ul className="space-y-2.5 text-sm text-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                <span>
                  This test has <strong>{questions.length} multiple-choice questions</strong> worth a total of{" "}
                  <strong>{totalPossibleMarks} marks</strong>.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                <span>
                  A countdown timer will run for{" "}
                  <strong>{formatQuizDuration(durationSeconds)}</strong>.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                <span>
                  If the timer expires, all answered questions will be{" "}
                  <strong>automatically submitted</strong>.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                <span>
                  Immediate score and answer breakdown will be presented upon submission.
                </span>
              </li>
            </ul>
          </CardContent>

          <CardFooter className="flex items-center justify-between border-t bg-muted/20 py-4">
            <Button variant="outline" onClick={() => router.push("/quizzes")}>
              Cancel
            </Button>
            <Button onClick={handleStartQuiz} className="gap-2 shadow-sm font-semibold">
              <PlayCircle className="size-4" />
              <span>Begin Test Now</span>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STAGE 3: RESULTS SUMMARY SCREEN
  // -------------------------------------------------------------
  if (stage === "results" && scoreResult) {
    const elapsedMinutes = Math.floor(timeTakenSeconds / 60);
    const elapsedRemainder = timeTakenSeconds % 60;
    const timeFormatted =
      elapsedMinutes > 0
        ? `${elapsedMinutes}m ${elapsedRemainder}s`
        : `${elapsedRemainder}s`;

    return (
      <div className="container mx-auto max-w-4xl px-4 py-10 sm:px-6 space-y-8">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/quizzes"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to All Quizzes</span>
          </Link>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRetakeQuiz}
            className="gap-1.5 text-xs"
          >
            <RotateCcw className="size-3.5" />
            <span>Retake Quiz</span>
          </Button>
        </div>

        {/* Scorecard Hero */}
        <div className="rounded-2xl border bg-card p-6 sm:p-8 shadow-sm space-y-6 text-center">
          <div className="max-w-md mx-auto space-y-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
                scoreResult.gradeBadgeClass
              )}
            >
              CDC Grade: {scoreResult.grade}
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Performance Summary
            </h2>
            <p className="text-xs text-muted-foreground">{quiz.title}</p>
          </div>

          {/* Metrics grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto pt-2">
            <div className="rounded-xl border bg-muted/20 p-4 space-y-1">
              <span className="text-xs text-muted-foreground">Score</span>
              <p className="text-2xl font-bold text-foreground">
                {scoreResult.score}{" "}
                <span className="text-xs text-muted-foreground font-normal">
                  / {scoreResult.total_marks}
                </span>
              </p>
            </div>

            <div className="rounded-xl border bg-muted/20 p-4 space-y-1">
              <span className="text-xs text-muted-foreground">Percentage</span>
              <p className="text-2xl font-bold text-foreground">
                {scoreResult.percentage}%
              </p>
            </div>

            <div className="rounded-xl border bg-muted/20 p-4 space-y-1">
              <span className="text-xs text-muted-foreground">Accuracy</span>
              <p className="text-2xl font-bold text-foreground">
                {scoreResult.correct_count}{" "}
                <span className="text-xs text-muted-foreground font-normal">
                  / {scoreResult.total_questions}
                </span>
              </p>
            </div>

            <div className="rounded-xl border bg-muted/20 p-4 space-y-1">
              <span className="text-xs text-muted-foreground">Time Taken</span>
              <p className="text-2xl font-bold text-foreground">
                {timeFormatted}
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Question Review Breakdown */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-foreground">
              Question-by-Question Review
            </h3>
            <span className="text-xs text-muted-foreground">
              {scoreResult.correct_count} of {scoreResult.total_questions} correct
            </span>
          </div>

          <div className="space-y-4">
            {scoreResult.breakdown.map((item, idx) => {
              return (
                <div
                  key={item.question_id || idx}
                  className={cn(
                    "rounded-xl border p-5 space-y-3.5 transition-all",
                    item.is_correct
                      ? "border-emerald-200 bg-emerald-50/20 dark:border-emerald-950/60 dark:bg-emerald-950/10"
                      : "border-red-200 bg-red-50/20 dark:border-red-950/60 dark:bg-red-950/10"
                  )}
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        Q{idx + 1}
                      </Badge>
                      <span className="text-xs font-semibold">
                        {item.is_correct ? (
                          <span className="text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1">
                            <CheckCircle2 className="size-3.5" /> Correct (+{item.marks_awarded} marks)
                          </span>
                        ) : (
                          <span className="text-red-600 dark:text-red-400 inline-flex items-center gap-1">
                            <XCircle className="size-3.5" /> Incorrect (0/{item.marks_possible} marks)
                          </span>
                        )}
                      </span>
                    </div>

                    <span className="text-[11px] text-muted-foreground">
                      Weight: {item.marks_possible} mark(s)
                    </span>
                  </div>

                  {/* Question Text */}
                  <p className="text-sm font-medium text-foreground">
                    {item.question}
                  </p>

                  {/* Options review */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {item.options.map((opt, oIdx) => {
                      const letter = String.fromCharCode(65 + oIdx);
                      const isStudentChoice = item.selected_answer === opt;
                      const isActualCorrect = item.correct_answer === opt;

                      let cardStyle = "border-border/60 bg-card text-foreground";
                      if (isActualCorrect) {
                        cardStyle =
                          "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200 font-semibold";
                      } else if (isStudentChoice && !item.is_correct) {
                        cardStyle =
                          "border-red-400 bg-red-50 text-red-900 dark:bg-red-950/60 dark:text-red-200 line-through";
                      }

                      return (
                        <div
                          key={oIdx}
                          className={cn(
                            "flex items-center justify-between rounded-lg border px-3 py-2 text-xs",
                            cardStyle
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{letter}.</span>
                            <span>{opt}</span>
                          </div>

                          {isActualCorrect && (
                            <Badge variant="secondary" className="text-[10px] bg-emerald-200 text-emerald-900 dark:bg-emerald-800 dark:text-emerald-100">
                              Correct Answer
                            </Badge>
                          )}
                          {isStudentChoice && !isActualCorrect && (
                            <Badge variant="secondary" className="text-[10px] bg-red-200 text-red-900 dark:bg-red-800 dark:text-red-100">
                              Your Answer
                            </Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {!item.selected_answer && (
                    <p className="text-[11px] text-amber-600 dark:text-amber-400 italic">
                      You did not select an answer for this question.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between border-t pt-6">
          <Button variant="outline" onClick={() => router.push("/quizzes")}>
            Back to Quizzes
          </Button>
          <Button onClick={handleRetakeQuiz} className="gap-2">
            <RotateCcw className="size-4" />
            <span>Retake Quiz</span>
          </Button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STAGE 2: ACTIVE EXAM / IN-PROGRESS SCREEN
  // -------------------------------------------------------------
  return (
    <div className="container mx-auto max-w-4xl px-4 py-6 sm:px-6 space-y-6">
      {/* Sticky Header with Title and Countdown Timer */}
      <div className="sticky top-16 z-30 flex items-center justify-between gap-4 rounded-xl border bg-background/95 p-4 shadow-sm backdrop-blur-md">
        <div>
          <h2 className="text-base font-bold text-foreground line-clamp-1">
            {quiz.title}
          </h2>
          <p className="text-xs text-muted-foreground">
            Question {currentQuestionIndex + 1} of {questions.length} •{" "}
            {answeredCount} answered
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Active Countdown Timer */}
          <div
            className={cn(
              "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-all",
              getTimerStyle()
            )}
          >
            <Clock className="size-4" />
            <span className="font-mono">{formatTimer(timeLeft)}</span>
          </div>

          <Button
            size="sm"
            onClick={() => setShowConfirmSubmit(true)}
            disabled={isSubmitting}
            className="gap-1.5 text-xs shadow-xs"
          >
            <Send className="size-3.5" />
            <span>Submit</span>
          </Button>
        </div>
      </div>

      {/* Question Navigation Bar (Pill selector) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {questions.map((q, idx) => {
          const isCurrent = idx === currentQuestionIndex;
          const isAnswered = Boolean(selectedAnswers[q.id || `q_${idx + 1}`]);

          return (
            <button
              key={q.id || idx}
              type="button"
              onClick={() => setCurrentQuestionIndex(idx)}
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-lg border text-xs font-semibold transition-all",
                isCurrent
                  ? "border-primary bg-primary text-primary-foreground shadow-xs ring-2 ring-primary/30"
                  : isAnswered
                  ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200"
                  : "border-muted bg-muted/30 text-muted-foreground hover:bg-muted"
              )}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Main Question Card */}
      {currentQuestion && (
        <Card className="border shadow-sm">
          <CardHeader className="space-y-3 pb-4">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-xs">
                Question {currentQuestionIndex + 1}
              </Badge>
              <span className="text-xs font-medium text-muted-foreground">
                Worth {currentQuestion.marks || 1} mark(s)
              </span>
            </div>

            <CardTitle className="text-lg font-semibold leading-relaxed text-foreground">
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3 pb-6">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
              Choose one option:
            </label>

            <div className="space-y-2.5">
              {currentQuestion.options?.map((option, optIdx) => {
                const qId = currentQuestion.id || `q_${currentQuestionIndex + 1}`;
                const isSelected = selectedAnswers[qId] === option;
                const optionLetter = String.fromCharCode(65 + optIdx);

                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => handleSelectOption(qId, option)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl border p-3.5 text-left text-sm transition-all outline-none",
                      isSelected
                        ? "border-primary bg-primary/10 text-foreground font-semibold shadow-2xs ring-1 ring-primary/40"
                        : "border-border/80 bg-card hover:bg-muted/40 text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "border border-muted-foreground/30 text-muted-foreground"
                        )}
                      >
                        {optionLetter}
                      </span>
                      <span>{option}</span>
                    </div>

                    {isSelected && (
                      <CheckCircle2 className="size-4 text-primary shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>

          <CardFooter className="flex items-center justify-between border-t bg-muted/20 py-3.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
              }
              disabled={currentQuestionIndex === 0}
              className="gap-1 text-xs"
            >
              <ArrowLeft className="size-3.5" />
              <span>Previous</span>
            </Button>

            <div className="text-xs text-muted-foreground">
              {currentQuestionIndex + 1} of {questions.length}
            </div>

            {currentQuestionIndex < questions.length - 1 ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentQuestionIndex((prev) =>
                    Math.min(questions.length - 1, prev + 1)
                  )
                }
                className="gap-1 text-xs"
              >
                <span>Next</span>
                <ArrowRight className="size-3.5" />
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => setShowConfirmSubmit(true)}
                className="gap-1.5 text-xs shadow-xs"
              >
                <Send className="size-3.5" />
                <span>Submit Quiz</span>
              </Button>
            )}
          </CardFooter>
        </Card>
      )}

      {/* Confirmation Dialog before submitting */}
      <Dialog open={showConfirmSubmit} onOpenChange={setShowConfirmSubmit}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Submit Quiz Attempt?</DialogTitle>
            <DialogDescription>
              {unansweredCount > 0 ? (
                <span className="text-amber-600 dark:text-amber-400 font-medium">
                  Warning: You have {unansweredCount} unanswered question(s). Unanswered questions will receive 0 marks.
                </span>
              ) : (
                <span>
                  You have answered all {questions.length} questions. Are you ready to see your final score and results?
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-2 sm:justify-between">
            <Button
              variant="outline"
              onClick={() => setShowConfirmSubmit(false)}
              disabled={isSubmitting}
            >
              Keep Answering
            </Button>
            <Button
              onClick={() =>
                submitAttempt(
                  selectedAnswers,
                  Math.max(1, durationSeconds - timeLeft)
                )
              }
              disabled={isSubmitting}
              className="gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Scoring...</span>
                </>
              ) : (
                <span>Confirm & Submit</span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
