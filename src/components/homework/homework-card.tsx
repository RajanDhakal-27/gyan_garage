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
  FileCheck2,
  Trash2,
  Pencil,
  Loader2,
  FileText,
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
    <Card className="flex flex-col justify-between transition-all hover:shadow-md border border-border/80">
      <CardHeader className="space-y-2 pb-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            {homework.subject && (
              <Badge variant="secondary" className="text-xs">
                {homework.subject}
              </Badge>
            )}

            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium",
                dueInfo.badgeClassName
              )}
            >
              <Clock className="size-3" />
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
                  className="text-muted-foreground hover:text-foreground hover:bg-muted"
                  title="Edit homework"
                  aria-label={`Edit ${homework.title}`}
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
                  title="Delete homework"
                  aria-label={`Delete ${homework.title}`}
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
          onClick={() => onViewDetails?.(homework)}
          className="text-left group text-foreground"
        >
          <CardTitle className="text-base font-semibold leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {homework.title}
          </CardTitle>
        </button>
      </CardHeader>

      <CardContent className="pb-4 space-y-2">
        {homework.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {homework.description}
          </p>
        )}

        {homework.instructions ? (
          <div className="rounded-md bg-muted/40 p-2.5 text-xs text-foreground/90 line-clamp-3 font-mono leading-relaxed border">
            {homework.instructions}
          </div>
        ) : (
          <p className="text-xs italic text-muted-foreground/60">
            No specific instructions attached.
          </p>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t bg-muted/20 pt-3 pb-3">
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <Calendar className="size-3" />
          <span>Due: {formattedDueDate}</span>
        </div>

        {onViewDetails && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(homework)}
            className="h-7 px-2.5 text-xs gap-1 shadow-2xs font-medium"
          >
            <span>Instructions</span>
            <ChevronRight className="size-3" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
