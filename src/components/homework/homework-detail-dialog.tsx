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
  FileText,
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
          <div className="flex flex-wrap items-center gap-2">
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

          <DialogTitle className="text-xl font-extrabold leading-snug">
            {homework.title}
          </DialogTitle>

          <DialogDescription className="flex flex-wrap items-center gap-4 text-xs text-[#635F69]">
            <span className="flex items-center gap-1">
              <Calendar className="size-3.5" />
              Deadline: <strong className="text-[#332F3A]">{formattedDueDate}</strong>
            </span>
            <span>Assigned: {formattedCreatedDate}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {homework.description && (
            <div className="border-l-4 border-[#7C3AED]/40 pl-3 text-sm italic leading-relaxed text-[#635F69]">
              {homework.description}
            </div>
          )}

          <div className="space-y-2">
            <span className="flex items-center gap-1.5 font-heading text-xs font-extrabold uppercase tracking-wide text-[#635F69]">
              <FileText className="size-4" />
              <span>Instructions & tasks</span>
            </span>
            <div className="whitespace-pre-wrap rounded-3xl border border-white/60 bg-[#EFEBF5] p-5 text-sm leading-relaxed text-[#332F3A] shadow-clayPressed">
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
