"use client";

import React, { useState } from "react";
import { LearningItem } from "@/types/database";
import { useRole } from "@/context/role-context";
import { getDueStatus } from "@/lib/homework";
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
  Calendar,
  Clock,
  Trash2,
  Pencil,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { cn } from "cn";

interface HomeworkCardProps {
  homework: LearningItem;
  now?: Date;
  onDelete?: (id: string) => Promise<void>;
  onEdit?: (homework: LearningItem) => void;
  onViewDetails?: (homework: LearningItem) => void;
}

export function HomeworkCard({
  homework,
  now,
  onDelete,
  onEdit,
  onViewDetails,
}: HomeworkCardProps) {
  const { isTeacher } = useRole();
  const [isDeleting, setIsDeleting] = useState(false);

  const dueInfo = getDueStatus(homework.due_at, now);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onDelete) return;
    const confirmed = window.confirm(
      `Are you sure you want to delete assignment "${homework.title}"?`
    );
    if (!confirmed) return;

    try {
      setIsDeleting(true);
      await onDelete(homework.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const formattedDueDate = homework.due_at
    ? new Date(homework.due_at).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })
    : "No deadline";

  return (
    <Card className="flex flex-col justify-between">
      <CardHeader className="space-y-3 pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {homework.subject && <Badge variant="secondary">{homework.subject}</Badge>}

            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-3 py-1 font-heading text-[11px] font-extrabold",
                dueInfo.badgeClassName
              )}
            >
              <Clock className="size-3.5" />
              {dueInfo.label}
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
                    onEdit(homework);
                  }}
                  title="Edit homework"
                  aria-label={`Edit ${homework.title}`}
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
                  title="Delete homework"
                  aria-label={`Delete ${homework.title}`}
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
          onClick={() => onViewDetails?.(homework)}
          className="group text-left text-[#332F3A]"
        >
          <CardTitle className="line-clamp-2 text-lg font-extrabold leading-snug transition-colors group-hover:text-[#7C3AED]">
            {homework.title}
          </CardTitle>
        </button>
      </CardHeader>

      <CardContent className="space-y-2 pb-4">
        {homework.description && (
          <p className="line-clamp-2 text-sm leading-relaxed text-[#635F69]">
            {homework.description}
          </p>
        )}

        {homework.instructions ? (
          <div className="line-clamp-3 rounded-2xl border border-white/60 bg-[#EFEBF5] p-3.5 text-xs leading-relaxed text-[#332F3A] shadow-clayPressed">
            {homework.instructions}
          </div>
        ) : (
          <p className="text-sm italic text-[#635F69]/80">
            No specific instructions attached.
          </p>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-4 pb-5">
        <div className="flex items-center gap-1.5 text-[11px] text-[#635F69]">
          <Calendar className="size-3.5" />
          <span>Due: {formattedDueDate}</span>
        </div>

        {onViewDetails && (
          <Button
            variant="outline"
            size="xs"
            onClick={() => onViewDetails(homework)}
          >
            <span>Instructions</span>
            <ChevronRight className="size-3.5" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
