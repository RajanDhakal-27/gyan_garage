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
          <div className="flex flex-wrap items-center gap-2">
            {quiz.subject && <Badge variant="secondary">{quiz.subject}</Badge>}
            <Badge variant="outline">
              <Clock className="size-3.5" />
              <span>{formatQuizDuration(quiz.duration_seconds)}</span>
            </Badge>
            <Badge variant="outline">
              <Layers className="size-3.5" />
              <span>{questionCount} questions</span>
            </Badge>
            <Badge variant="outline">
              <Award className="size-3.5" />
              <span>{totalMarks} marks</span>
            </Badge>
          </div>

          <DialogTitle className="text-xl font-extrabold leading-snug">
            {quiz.title}
          </DialogTitle>

          <DialogDescription className="flex items-center gap-1 text-xs text-[#635F69]">
            <Calendar className="size-3.5" />
            <span>Created on {formattedDate}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {quiz.description && (
            <div className="rounded-3xl bg-[#EFEBF5] p-4 text-sm leading-relaxed text-[#332F3A] shadow-clayPressed">
              {quiz.description}
            </div>
          )}

          {/* Questions preview */}
          <div className="space-y-3">
            <h4 className="flex items-center gap-1.5 font-heading text-xs font-extrabold uppercase tracking-wide text-[#635F69]">
              <HelpCircle className="size-4" />
              Questions overview ({questionCount})
            </h4>

            <div className="space-y-3">
              {quiz.questions?.map((q, idx) => (
                <div
                  key={q.id || idx}
                  className="space-y-2 rounded-[24px] border border-white/70 bg-white/70 p-4 text-xs shadow-clayCard"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold leading-relaxed text-[#332F3A]">
                      {idx + 1}. {q.question}
                    </span>
                    <Badge variant="secondary" className="shrink-0">
                      {q.marks || 1} mark
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 gap-1.5 pt-1 sm:grid-cols-2">
                    {q.options?.map((opt, oIdx) => {
                      const letter = String.fromCharCode(65 + oIdx);
                      return (
                        <div
                          key={oIdx}
                          className="flex items-center gap-1.5 rounded-xl bg-[#EFEBF5] px-2.5 py-1.5 text-[#635F69] shadow-clayPressed"
                        >
                          <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#7C3AED]/10 font-heading text-[10px] font-extrabold text-[#7C3AED]">
                            {letter}
                          </span>
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
            >
              <span>Take quiz now</span>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
