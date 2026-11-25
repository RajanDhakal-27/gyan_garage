"use client";

import React from "react";
import { LearningItem } from "@/types/database";
import { getDueStatus } from "@/lib/homework";
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
  Calendar,
  Clock,
  BookOpen,
  FileText,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { cn } from "cn";

interface HomeworkDetailDialogProps {
  homework: LearningItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HomeworkDetailDialog({
  homework,
  open,
  onOpenChange,
}: HomeworkDetailDialogProps) {
  if (!homework) return null;

  const dueInfo = getDueStatus(homework.due_at);

  const formattedDueDate = homework.due_at
    ? new Date(homework.due_at).toLocaleString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "No due date specified";

  const formattedCreatedDate = new Date(homework.created_at).toLocaleDateString(
    undefined,
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
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

          <DialogTitle className="text-lg font-bold leading-snug">
            {homework.title}
          </DialogTitle>

          <DialogDescription className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1">
              <Calendar className="size-3" />
              Deadline: <strong className="text-foreground">{formattedDueDate}</strong>
            </span>
            <span>Assigned: {formattedCreatedDate}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {homework.description && (
            <div className="text-xs text-muted-foreground italic border-l-2 border-primary/40 pl-2.5">
              {homework.description}
            </div>
          )}

          <div className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <FileText className="size-3.5" />
              <span>Instructions & Assignment Tasks:</span>
            </span>
            <div className="rounded-lg bg-muted/40 p-4 text-sm leading-relaxed text-foreground whitespace-pre-wrap font-sans border">
              {homework.instructions || "No detailed instructions provided."}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
