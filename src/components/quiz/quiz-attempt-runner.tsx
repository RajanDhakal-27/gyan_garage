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
  PlayCircle,
  RotateCcw,
  Send,
  Loader2,
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

  // Scroll to the top whenever the attempt stage changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [stage]);

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
      return "bg-[#DB2777]/10 text-[#DB2777] border-[#DB2777]/30 animate-clay-breathe";
    }
    if (timeLeft <= 60) {
      return "bg-[#F59E0B]/10 text-[#B45309] border-[#F59E0B]/30";
    }
    return "bg-[#0EA5E9]/10 text-[#0284C7] border-[#0EA5E9]/25";
  };

  // -------------------------------------------------------------
  // STAGE 1: INTRO / PRE-QUIZ SCREEN
  // -------------------------------------------------------------
  if (stage === "intro") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Link
          href="/quizzes"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-bold text-[#635F69] transition-colors hover:text-[#7C3AED]"
        >
          <ArrowLeft className="size-4" />
          <span>Back to quizzes</span>
        </Link>

        <Card className="overflow-hidden rounded-[40px]">
          <CardHeader className="space-y-4 border-b border-white/60 pb-6">
            <div className="flex flex-wrap items-center gap-2">
              {quiz.subject && <Badge variant="secondary">{quiz.subject}</Badge>}
              <Badge variant="outline">
                <Clock className="size-3.5" />
                <span>{formatQuizDuration(durationSeconds)}</span>
              </Badge>
              <Badge variant="outline">
                <Award className="size-3.5" />
                <span>{totalPossibleMarks} marks</span>
              </Badge>
            </div>

            <CardTitle className="text-2xl font-black leading-tight tracking-tight text-[#332F3A] sm:text-3xl">
              {quiz.title}
            </CardTitle>

            {quiz.description && (
              <p className="text-sm leading-relaxed text-[#635F69]">
                {quiz.description}
              </p>
            )}
          </CardHeader>

          <CardContent className="space-y-4 py-6">
            <h4 className="font-heading text-xs font-extrabold uppercase tracking-wide text-[#635F69]">
              Test instructions
            </h4>
            <div className="space-y-3 rounded-[28px] bg-[#EFEBF5] p-5 shadow-clayPressed">
              <div className="flex items-start gap-3 text-sm leading-relaxed text-[#332F3A]">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#10B981]" />
                <span>
                  This test has{" "}
                  <strong>{questions.length} multiple-choice questions</strong>{" "}
                  worth a total of <strong>{totalPossibleMarks} marks</strong>.
                </span>
              </div>
              <div className="flex items-start gap-3 text-sm leading-relaxed text-[#332F3A]">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#10B981]" />
                <span>
                  A countdown timer will run for{" "}
                  <strong>{formatQuizDuration(durationSeconds)}</strong>.
                </span>
              </div>
              <div className="flex items-start gap-3 text-sm leading-relaxed text-[#332F3A]">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#10B981]" />
                <span>
                  If the timer expires, all answered questions will be{" "}
                  <strong>automatically submitted</strong>.
                </span>
              </div>
              <div className="flex items-start gap-3 text-sm leading-relaxed text-[#332F3A]">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#10B981]" />
                <span>
                  Immediate score and answer breakdown will be presented upon
                  submission.
                </span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-wrap items-center justify-between gap-3 border-t border-white/60 bg-white/40 py-4">
            <Button variant="outline" onClick={() => router.push("/quizzes")}>
              Cancel
            </Button>
            <Button onClick={handleStartQuiz}>
              <PlayCircle className="size-4" />
              <span>Begin test now</span>
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
      <div className="mx-auto max-w-4xl space-y-7 px-4 py-10 sm:px-6">
        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/quizzes"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#635F69] transition-colors hover:text-[#7C3AED]"
          >
            <ArrowLeft className="size-4" />
            <span>Back to all quizzes</span>
          </Link>

          <Button variant="outline" size="sm" onClick={handleRetakeQuiz}>
            <RotateCcw className="size-4" />
            <span>Retake quiz</span>
          </Button>
        </div>

        {/* Scorecard Hero */}
        <div className="space-y-6 rounded-[40px] border border-white/70 bg-white/70 p-6 text-center shadow-clayCard backdrop-blur-xl sm:p-8">
          <div className="mx-auto max-w-md space-y-3">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 font-heading text-xs font-extrabold",
                scoreResult.gradeBadgeClass
              )}
            >
              CDC Grade: {scoreResult.grade}
            </span>
            <h2 className="font-heading text-2xl font-black tracking-tight text-[#332F3A] sm:text-3xl">
              Performance summary
            </h2>
            <p className="text-xs text-[#635F69]">{quiz.title}</p>
          </div>

          {/* Metrics grid */}
          <div className="mx-auto grid max-w-2xl grid-cols-2 gap-4 pt-2 sm:grid-cols-4">
            <div className="space-y-1 rounded-[24px] bg-[#EFEBF5] p-4 shadow-clayPressed">
              <span className="font-heading text-[11px] font-extrabold uppercase tracking-wide text-[#635F69]">
                Score
              </span>
              <p className="font-heading text-2xl font-black text-[#332F3A]">
                {scoreResult.score}{" "}
                <span className="text-xs font-bold text-[#635F69]">
                  / {scoreResult.total_marks}
                </span>
              </p>
            </div>

            <div className="space-y-1 rounded-[24px] bg-[#EFEBF5] p-4 shadow-clayPressed">
              <span className="font-heading text-[11px] font-extrabold uppercase tracking-wide text-[#635F69]">
                Percentage
              </span>
              <p className="font-heading text-2xl font-black text-[#332F3A]">
                {scoreResult.percentage}%
              </p>
            </div>

            <div className="space-y-1 rounded-[24px] bg-[#EFEBF5] p-4 shadow-clayPressed">
              <span className="font-heading text-[11px] font-extrabold uppercase tracking-wide text-[#635F69]">
                Accuracy
              </span>
              <p className="font-heading text-2xl font-black text-[#332F3A]">
                {scoreResult.correct_count}{" "}
                <span className="text-xs font-bold text-[#635F69]">
                  / {scoreResult.total_questions}
                </span>
              </p>
            </div>

            <div className="space-y-1 rounded-[24px] bg-[#EFEBF5] p-4 shadow-clayPressed">
              <span className="font-heading text-[11px] font-extrabold uppercase tracking-wide text-[#635F69]">
                Time taken
              </span>
              <p className="font-heading text-2xl font-black text-[#332F3A]">
                {timeFormatted}
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Question Review Breakdown */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-heading text-lg font-extrabold text-[#332F3A]">
              Question-by-question review
            </h3>
            <span className="text-xs text-[#635F69]">
              {scoreResult.correct_count} of {scoreResult.total_questions} correct
            </span>
          </div>

          <div className="space-y-4">
            {scoreResult.breakdown.map((item, idx) => {
              return (
                <div
                  key={item.question_id || idx}
                  className={cn(
                    "space-y-3.5 rounded-[32px] border p-5 backdrop-blur-xl transition-all",
                    item.is_correct
                      ? "border-[#10B981]/25 bg-[#10B981]/5 shadow-clayCard"
                      : "border-[#DB2777]/25 bg-[#DB2777]/5 shadow-clayCard"
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Q{idx + 1}</Badge>
                      <span className="font-heading text-xs font-extrabold">
                        {item.is_correct ? (
                          <span className="inline-flex items-center gap-1 text-[#047857]">
                            <CheckCircle2 className="size-4" /> Correct (+
                            {item.marks_awarded} marks)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[#DB2777]">
                            <XCircle className="size-4" /> Incorrect (0/
                            {item.marks_possible} marks)
                          </span>
                        )}
                      </span>
                    </div>

                    <span className="text-[11px] text-[#635F69]">
                      Weight: {item.marks_possible} mark(s)
                    </span>
                  </div>

                  {/* Question Text */}
                  <p className="text-sm font-bold leading-relaxed text-[#332F3A]">
                    {item.question}
                  </p>

                  {/* Options review */}
                  <div className="grid grid-cols-1 gap-2 pt-1 sm:grid-cols-2">
                    {item.options.map((opt, oIdx) => {
                      const letter = String.fromCharCode(65 + oIdx);
                      const isStudentChoice = item.selected_answer === opt;
                      const isActualCorrect = item.correct_answer === opt;

                      let cardStyle =
                        "border-white/70 bg-white/70 text-[#332F3A] shadow-clayCard";
                      if (isActualCorrect) {
                        cardStyle =
                          "border-[#10B981]/40 bg-[#10B981]/10 text-[#047857] font-bold";
                      } else if (isStudentChoice && !item.is_correct) {
                        cardStyle =
                          "border-[#DB2777]/40 bg-[#DB2777]/10 text-[#DB2777] line-through";
                      }

                      return (
                        <div
                          key={oIdx}
                          className={cn(
                            "flex items-center justify-between gap-2 rounded-2xl border px-3.5 py-2.5 text-xs",
                            cardStyle
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-heading font-extrabold">
                              {letter}.
                            </span>
                            <span>{opt}</span>
                          </div>

                          {isActualCorrect && (
                            <Badge variant="secondary">Correct</Badge>
                          )}
                          {isStudentChoice && !isActualCorrect && (
                            <Badge variant="outline">Your answer</Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {!item.selected_answer && (
                    <p className="text-[11px] italic text-[#B45309]">
                      You did not select an answer for this question.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/60 pt-6">
          <Button variant="outline" onClick={() => router.push("/quizzes")}>
            Back to quizzes
          </Button>
          <Button onClick={handleRetakeQuiz}>
            <RotateCcw className="size-4" />
            <span>Retake quiz</span>
          </Button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STAGE 2: ACTIVE EXAM / IN-PROGRESS SCREEN
  // -------------------------------------------------------------
  return (
    <div className="mx-auto max-w-4xl space-y-5 px-4 py-6 sm:px-6">
      {/* Sticky Header with Title and Countdown Timer */}
      <div className="sticky top-20 z-30 flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-white/70 bg-white/80 p-4 shadow-clayCard backdrop-blur-xl">
        <div>
          <h2 className="line-clamp-1 font-heading text-base font-extrabold text-[#332F3A]">
            {quiz.title}
          </h2>
          <p className="text-xs text-[#635F69]">
            Question {currentQuestionIndex + 1} of {questions.length} ·{" "}
            {answeredCount} answered
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Active Countdown Timer */}
          <div
            className={cn(
              "flex items-center gap-1.5 rounded-2xl border px-3.5 py-2 font-heading text-sm font-extrabold transition-all",
              getTimerStyle()
            )}
          >
            <Clock className="size-4" />
            <span>{formatTimer(timeLeft)}</span>
          </div>

          <Button
            size="sm"
            onClick={() => setShowConfirmSubmit(true)}
            disabled={isSubmitting}
          >
            <Send className="size-4" />
            <span>Submit</span>
          </Button>
        </div>
      </div>

      {/* Question Navigation Bar (Pill selector) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {questions.map((q, idx) => {
          const isCurrent = idx === currentQuestionIndex;
          const isAnswered = Boolean(selectedAnswers[q.id || `q_${idx + 1}`]);

          return (
            <button
              key={q.id || idx}
              type="button"
              onClick={() => setCurrentQuestionIndex(idx)}
              className={cn(
                "flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-2xl border font-heading text-xs font-extrabold transition-all duration-200",
                isCurrent
                  ? "border-transparent bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] text-white shadow-clayButton"
                  : isAnswered
                    ? "border-[#10B981]/30 bg-[#10B981]/10 text-[#047857]"
                    : "border-white/70 bg-[#EFEBF5] text-[#635F69] shadow-clayPressed hover:-translate-y-0.5"
              )}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Main Question Card */}
      {currentQuestion && (
        <Card className="rounded-[36px]">
          <CardHeader className="space-y-3 pb-4">
            <div className="flex items-center justify-between">
              <Badge variant="secondary">
                Question {currentQuestionIndex + 1}
              </Badge>
              <span className="text-xs font-bold text-[#635F69]">
                Worth {currentQuestion.marks || 1} mark(s)
              </span>
            </div>

            <CardTitle className="text-lg font-extrabold leading-relaxed text-[#332F3A]">
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3 pb-6">
            <label className="block font-heading text-xs font-extrabold uppercase tracking-wide text-[#635F69]">
              Choose one option
            </label>

            <div className="space-y-2.5">
              {currentQuestion.options?.map((option, optIdx) => {
                const qId =
                  currentQuestion.id || `q_${currentQuestionIndex + 1}`;
                const isSelected = selectedAnswers[qId] === option;
                const optionLetter = String.fromCharCode(65 + optIdx);

                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => handleSelectOption(qId, option)}
                    className={cn(
                      "flex w-full cursor-pointer items-center justify-between rounded-2xl border p-4 text-left text-sm outline-none transition-all duration-200",
                      isSelected
                        ? "border-[#7C3AED]/40 bg-[#7C3AED]/10 font-bold text-[#332F3A] shadow-clayCard"
                        : "border-white/70 bg-white/70 text-[#332F3A] shadow-clayCard hover:-translate-y-0.5 hover:shadow-clayDeep"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center rounded-xl font-heading text-xs font-extrabold transition-colors",
                          isSelected
                            ? "bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] text-white shadow-clayButton"
                            : "bg-[#EFEBF5] text-[#635F69] shadow-clayPressed"
                        )}
                      >
                        {optionLetter}
                      </span>
                      <span>{option}</span>
                    </div>

                    {isSelected && (
                      <CheckCircle2 className="size-5 shrink-0 text-[#7C3AED]" />
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>

          <CardFooter className="flex flex-wrap items-center justify-between gap-3 border-t border-white/60 bg-white/40 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
              }
              disabled={currentQuestionIndex === 0}
            >
              <ArrowLeft className="size-4" />
              <span>Previous</span>
            </Button>

            <div className="text-xs font-bold text-[#635F69]">
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
              >
                <span>Next</span>
                <ArrowRight className="size-4" />
              </Button>
            ) : (
              <Button size="sm" onClick={() => setShowConfirmSubmit(true)}>
                <Send className="size-4" />
                <span>Submit quiz</span>
              </Button>
            )}
          </CardFooter>
        </Card>
      )}

      {/* Confirmation Dialog before submitting */}
      <Dialog open={showConfirmSubmit} onOpenChange={setShowConfirmSubmit}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Submit quiz attempt?</DialogTitle>
            <DialogDescription>
              {unansweredCount > 0 ? (
                <span className="font-bold text-[#B45309]">
                  Warning: You have {unansweredCount} unanswered question(s).
                  Unanswered questions will receive 0 marks.
                </span>
              ) : (
                <span>
                  You have answered all {questions.length} questions. Are you
                  ready to see your final score and results?
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
              Keep answering
            </Button>
            <Button
              onClick={() =>
                submitAttempt(
                  selectedAnswers,
                  Math.max(1, durationSeconds - timeLeft)
                )
              }
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Scoring…</span>
                </>
              ) : (
                <span>Confirm & submit</span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
