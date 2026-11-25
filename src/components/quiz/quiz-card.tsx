"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Quiz } from "@/types/database";
import { useRole } from "@/context/role-context";
import { formatQuizDuration, calculateTotalMarks } from "@/lib/quiz";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Award,
  Layers,
  Trash2,
  Pencil,
  Eye,
  PlayCircle,
  Loader2,
  Calendar,
} from "lucide-react";

interface QuizCardProps {
  quiz: Quiz;
  onDelete?: (id: string) => Promise<void>;
  onEdit?: (quiz: Quiz) => void;
  onViewDetails?: (quiz: Quiz) => void;
  onStartQuiz?: (quiz: Quiz) => void;
}

export function QuizCard({
  quiz,
  onDelete,
  onEdit,
  onViewDetails,
  onStartQuiz,
}: QuizCardProps) {
  const { isTeacher } = useRole();
  const [isDeleting, setIsDeleting] = useState(false);

  const totalMarks = calculateTotalMarks(quiz.questions || []);
  const questionCount = quiz.questions?.length || 0;

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onDelete) return;
    const confirmed = window.confirm(
      `Are you sure you want to delete quiz "${quiz.title}"?`
    );
    if (!confirmed) return;

    try {
      setIsDeleting(true);
      await onDelete(quiz.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const formattedDate = new Date(quiz.created_at).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

  return (
    <Card className="flex flex-col justify-between transition-all hover:shadow-md border border-border/80">
      <CardHeader className="space-y-2 pb-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            {quiz.subject && (
              <Badge variant="secondary" className="text-xs">
                {quiz.subject}
              </Badge>
            )}

            <span className="inline-flex items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300">
              <Clock className="size-3" />
              {formatQuizDuration(quiz.duration_seconds)}
            </span>

            <span className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium text-muted-foreground">
              <Layers className="size-3" />
              {questionCount} Qs
            </span>
          </div>

          {isTeacher && (
            <div className="flex items-center gap-1">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(quiz);
                  }}
                  className="text-muted-foreground hover:text-foreground hover:bg-muted"
                  title="Edit quiz"
                  aria-label={`Edit ${quiz.title}`}
                >
                  <Pencil className="size-3.5" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  title="Delete quiz"
                  aria-label={`Delete ${quiz.title}`}
                >
                  {isDeleting ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="size-3.5" />
                  )}
                </Button>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => onViewDetails?.(quiz)}
          className="text-left group text-foreground"
        >
          <CardTitle className="text-base font-semibold leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {quiz.title}
          </CardTitle>
        </button>
      </CardHeader>

      <CardContent className="pb-4 space-y-2">
        {quiz.description ? (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {quiz.description}
          </p>
        ) : (
          <p className="text-xs italic text-muted-foreground/60">
            No specific syllabus notes provided.
          </p>
        )}

        <div className="flex items-center gap-3 pt-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Award className="size-3.5 text-amber-500" />
            <span>Total: <strong>{totalMarks} Marks</strong></span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Calendar className="size-3" />
            <span>{formattedDate}</span>
          </span>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t bg-muted/20 pt-3 pb-3">
        {onViewDetails && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails(quiz)}
            className="h-7 px-2.5 text-xs gap-1 text-muted-foreground hover:text-foreground"
          >
            <Eye className="size-3.5" />
            <span>Preview Qs</span>
          </Button>
        )}

        {onStartQuiz ? (
          <Button
            size="sm"
            onClick={() => onStartQuiz(quiz)}
            className="h-7 px-3 text-xs gap-1 shadow-2xs"
          >
            <PlayCircle className="size-3.5" />
            <span>Start Quiz</span>
          </Button>
        ) : (
          <Link href={`/quizzes/${quiz.id}`}>
            <Button
              size="sm"
              className="h-7 px-3 text-xs gap-1 shadow-2xs"
            >
              <PlayCircle className="size-3.5" />
              <span>Start Quiz</span>
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
