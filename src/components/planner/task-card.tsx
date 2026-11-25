"use client";

import React, { useState } from "react";
import { StudyTask } from "@/types/database";
import { formatTargetDate } from "@/lib/study-planner";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Trash2,
  Pencil,
  Clock,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { cn } from "cn";

interface TaskCardProps {
  task: StudyTask;
  now?: Date;
  onToggleComplete: (id: string, currentCompleted: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (task: StudyTask) => void;
}

export function TaskCard({
  task,
  now,
  onToggleComplete,
  onDelete,
  onEdit,
}: TaskCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const dateStatus = formatTargetDate(task.target_date, now);

  const handleToggle = async () => {
    try {
      setIsUpdating(true);
      await onToggleComplete(task.id, task.is_completed);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Delete study target "${task.title}"?`
    );
    if (!confirmed) return;

    try {
      setIsDeleting(true);
      await onDelete(task.id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className={cn(
        "group flex flex-col justify-between rounded-xl border p-4 transition-all duration-150 sm:flex-row sm:items-center gap-3",
        task.is_completed
          ? "border-muted bg-muted/20 opacity-75"
          : "border-border/80 bg-card hover:border-primary/40 hover:shadow-2xs"
      )}
    >
      {/* Left side: Checkbox + Title + Description */}
      <div className="flex items-start gap-3.5 flex-1 min-w-0">
        <button
          type="button"
          onClick={handleToggle}
          disabled={isUpdating}
          className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border border-primary/50 transition-colors hover:bg-primary/10 focus-visible:ring-2 focus-visible:ring-primary/40"
          aria-label={
            task.is_completed
              ? `Mark "${task.title}" as incomplete`
              : `Mark "${task.title}" as completed`
          }
        >
          {task.is_completed ? (
            <CheckCircle2 className="size-5 text-primary fill-primary/10" />
          ) : (
            <span className="size-3 rounded-xs" />
          )}
        </button>

        <div className="space-y-1 min-w-0 flex-1">
          <p
            className={cn(
              "text-sm font-medium leading-snug break-words transition-all",
              task.is_completed
                ? "line-through text-muted-foreground"
                : "text-foreground"
            )}
          >
            {task.title}
          </p>

          {task.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {task.description}
            </p>
          )}
        </div>
      </div>

      {/* Right side: Target date badge + Action buttons */}
      <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-muted/30">
        {task.target_date && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium",
              dateStatus.badgeClass
            )}
          >
            <Calendar className="size-3" />
            <span>{dateStatus.label}</span>
          </span>
        )}

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onEdit(task)}
            className="text-muted-foreground hover:text-foreground hover:bg-muted"
            title="Edit target"
            aria-label={`Edit ${task.title}`}
          >
            <Pencil className="size-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="icon-xs"
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            title="Delete target"
            aria-label={`Delete ${task.title}`}
          >
            {isDeleting ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Trash2 className="size-3.5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
