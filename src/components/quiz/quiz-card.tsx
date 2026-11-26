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
    <Card className="flex flex-col justify-between">
      <CardHeader className="space-y-3 pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {quiz.subject && <Badge variant="secondary">{quiz.subject}</Badge>}

            <span className="inline-flex items-center gap-1 rounded-full border border-[#0EA5E9]/20 bg-[#0EA5E9]/10 px-3 py-1 font-heading text-[11px] font-extrabold text-[#0284C7]">
              <Clock className="size-3.5" />
              {formatQuizDuration(quiz.duration_seconds)}
            </span>

            <span className="inline-flex items-center gap-1 rounded-full border border-white/70 bg-white/60 px-3 py-1 font-heading text-[11px] font-extrabold text-[#635F69]">
              <Layers className="size-3.5" />
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
                  title="Edit quiz"
                  aria-label={`Edit ${quiz.title}`}
                >
                  <Pencil className="size-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-[#635F69] hover:bg-[#DB2777]/10 hover:text-[#DB2777]"
                  title="Delete quiz"
                  aria-label={`Delete ${quiz.title}`}
                >
                  {isDeleting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Trash2 className="size-4" />
                  )}
                </Button>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => onViewDetails?.(quiz)}
          className="group text-left text-[#332F3A]"
        >
          <CardTitle className="line-clamp-2 text-lg font-extrabold leading-snug transition-colors group-hover:text-[#7C3AED]">
            {quiz.title}
          </CardTitle>
        </button>
      </CardHeader>

      <CardContent className="space-y-2 pb-4">
        {quiz.description ? (
          <p className="line-clamp-2 text-sm leading-relaxed text-[#635F69]">
            {quiz.description}
          </p>
        ) : (
          <p className="text-sm italic text-[#635F69]/80">
            No specific syllabus notes provided.
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-[#635F69]">
          <span className="flex items-center gap-1.5">
            <Award className="size-4 text-[#F59E0B]" />
            <span>
              Total: <strong className="text-[#332F3A]">{totalMarks} marks</strong>
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="size-3.5" />
            <span>{formattedDate}</span>
          </span>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-4 pb-5">
        {onViewDetails && (
          <Button
            variant="ghost"
            size="xs"
            onClick={() => onViewDetails(quiz)}
          >
            <Eye className="size-3.5" />
            <span>Preview</span>
          </Button>
        )}

        {onStartQuiz ? (
          <Button size="xs" onClick={() => onStartQuiz(quiz)}>
            <PlayCircle className="size-4" />
            <span>Start quiz</span>
          </Button>
        ) : (
          <Link href={`/quizzes/${quiz.id}`}>
            <Button size="xs">
              <PlayCircle className="size-4" />
              <span>Start quiz</span>
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
