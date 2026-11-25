"use client";

import React from "react";
import { Quiz } from "@/types/database";
import { formatQuizDuration, calculateTotalMarks } from "@/lib/quiz";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Award,
  Layers,
  HelpCircle,
  Calendar,
  CheckCircle2,
} from "lucide-react";

interface QuizDetailDialogProps {
  quiz: Quiz | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStartQuiz?: (quiz: Quiz) => void;
}

export function QuizDetailDialog({
  quiz,
  open,
  onOpenChange,
  onStartQuiz,
}: QuizDetailDialogProps) {
  if (!quiz) return null;

  const totalMarks = calculateTotalMarks(quiz.questions || []);
  const questionCount = quiz.questions?.length || 0;

  const formattedDate = new Date(quiz.created_at).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            {quiz.subject && (
              <Badge variant="secondary" className="text-xs">
                {quiz.subject}
              </Badge>
            )}
            <Badge variant="outline" className="text-xs gap-1">
              <Clock className="size-3" />
              <span>{formatQuizDuration(quiz.duration_seconds)}</span>
            </Badge>
            <Badge variant="outline" className="text-xs gap-1">
              <Layers className="size-3" />
              <span>{questionCount} Questions</span>
            </Badge>
            <Badge variant="outline" className="text-xs gap-1">
              <Award className="size-3" />
              <span>{totalMarks} Marks</span>
            </Badge>
          </div>

          <DialogTitle className="text-xl font-bold leading-tight">
            {quiz.title}
          </DialogTitle>

          <DialogDescription className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="size-3" />
            <span>Created on {formattedDate}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {quiz.description && (
            <div className="rounded-lg bg-muted/40 p-3.5 text-sm leading-relaxed text-foreground border">
              {quiz.description}
            </div>
          )}

          {/* Questions preview */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Questions Overview ({questionCount})
            </h4>

            <div className="space-y-3">
              {quiz.questions?.map((q, idx) => (
                <div
                  key={q.id || idx}
                  className="rounded-lg border bg-card p-3 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-foreground">
                      {idx + 1}. {q.question}
                    </span>
                    <Badge variant="secondary" className="text-[10px] shrink-0">
                      {q.marks || 1} mark
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                    {q.options?.map((opt, oIdx) => {
                      const letter = String.fromCharCode(65 + oIdx);
                      return (
                        <div
                          key={oIdx}
                          className="flex items-center gap-1.5 rounded-md bg-muted/30 px-2 py-1 text-muted-foreground"
                        >
                          <span className="font-bold text-[10px]">{letter}.</span>
                          <span className="truncate">{opt}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>

          {onStartQuiz && (
            <Button
              onClick={() => {
                onOpenChange(false);
                onStartQuiz(quiz);
              }}
              className="gap-1.5"
            >
              <span>Take Quiz Now</span>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
