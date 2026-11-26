"use client";

import React, { useState } from "react";
import { StudyTask } from "@/types/database";
import { formatTargetDate } from "@/lib/study-planner";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Trash2,
  Pencil,
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
        "group flex flex-col justify-between gap-3 rounded-[28px] border p-4 transition-all duration-300 sm:flex-row sm:items-center sm:p-5",
        task.is_completed
          ? "border-white/50 bg-white/40 opacity-75 shadow-clayPressed"
          : "border-white/70 bg-white/70 shadow-clayCard backdrop-blur-xl hover:-translate-y-1 hover:shadow-clayDeep"
      )}
    >
      {/* Left side: Checkbox + Title + Description */}
      <div className="flex min-w-0 flex-1 items-start gap-3.5">
        <button
          type="button"
          onClick={handleToggle}
          disabled={isUpdating}
          className="mt-0.5 flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-[#7C3AED]/30 bg-[#EFEBF5] text-[#7C3AED] shadow-clayPressed transition-all hover:text-[#DB2777] focus-visible:ring-2 focus-visible:ring-[#7C3AED]/40"
          aria-label={
            task.is_completed
              ? `Mark "${task.title}" as incomplete`
              : `Mark "${task.title}" as completed`
          }
        >
          {task.is_completed ? (
            <CheckCircle2 className="size-5 fill-[#10B981]/15 text-[#10B981]" />
          ) : (
            <span className="size-2.5 rounded-full bg-[#7C3AED]/25" />
          )}
        </button>

        <div className="min-w-0 flex-1 space-y-1">
          <p
            className={cn(
              "break-words text-sm font-bold leading-snug transition-all",
              task.is_completed
                ? "text-[#635F69] line-through"
                : "text-[#332F3A]"
            )}
          >
            {task.title}
          </p>

          {task.description && (
            <p className="line-clamp-2 text-xs leading-relaxed text-[#635F69]">
              {task.description}
            </p>
          )}
        </div>
      </div>

      {/* Right side: Target date badge + Action buttons */}
      <div className="flex shrink-0 items-center justify-between gap-2.5 border-t border-white/60 pt-2 sm:justify-end sm:border-t-0 sm:pt-0">
        {task.target_date && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-3 py-1 font-heading text-[11px] font-extrabold",
              dateStatus.badgeClass
            )}
          >
            <Calendar className="size-3.5" />
            <span>{dateStatus.label}</span>
          </span>
        )}

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onEdit(task)}
            title="Edit target"
            aria-label={`Edit ${task.title}`}
          >
            <Pencil className="size-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon-xs"
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-[#635F69] hover:bg-[#DB2777]/10 hover:text-[#DB2777]"
            title="Delete target"
            aria-label={`Delete ${task.title}`}
          >
            {isDeleting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
