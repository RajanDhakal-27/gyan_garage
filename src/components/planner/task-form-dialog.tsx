"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { StudyTask } from "@/types/database";
import { validateStudyTaskInput } from "@/lib/study-planner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

const QUICK_TARGET_SUGGESTIONS = [
  "Revise Opt Math formulas",
  "Read Science chapter",
  "Solve 5 Model Questions",
  "Practice English Essay",
  "Memorize Nepali Byakaran rules",
];

interface TaskFormDialogProps {
  onTaskSaved: () => void;
  initialData?: StudyTask | null;
  triggerButton?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function TaskFormDialog({
  onTaskSaved,
  initialData,
  triggerButton,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: TaskFormDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = (val: boolean) => {
    if (isControlled && setControlledOpen) {
      setControlledOpen(val);
    } else {
      setInternalOpen(val);
    }
  };

  const isEditMode = Boolean(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setTargetDate(initialData.target_date || "");
      setDescription(initialData.description || "");
      setErrors({});
    } else {
      resetForm();
    }
  }, [initialData, open]);

  const resetForm = () => {
    setTitle("");
    setTargetDate("");
    setDescription("");
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateStudyTaskInput({
      title,
      target_date: targetDate || undefined,
      description,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors({});

      if (isEditMode && initialData) {
        const { error: updateErr } = await supabase
          .from("study_tasks")
          .update({
            title: title.trim(),
            target_date: targetDate || null,
            description: description.trim() || null,
          })
          .eq("id", initialData.id);

        if (updateErr) throw updateErr;
        toast.success("Study target updated!");
      } else {
        const { error: insertErr } = await supabase.from("study_tasks").insert({
          title: title.trim(),
          target_date: targetDate || null,
          description: description.trim() || null,
          is_completed: false,
        });

        if (insertErr) throw insertErr;
        toast.success("Study target created!");
      }

      resetForm();
      setOpen(false);
      onTaskSaved();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save study target.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {triggerButton ? (
        <DialogTrigger render={triggerButton as React.ReactElement} />
      ) : !isControlled ? (
        <DialogTrigger
          render={
            <Button>
              <Plus className="size-4" />
              <span>Add target</span>
            </Button>
          }
        />
      ) : null}

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit study target" : "Add study target"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update your study goal, scheduled target date or notes."
              : "Set a personal study target or to-do item to track your preparation."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Title */}
          <div className="space-y-1.5">
            <label
              htmlFor="target_title"
              className="font-heading text-xs font-extrabold uppercase tracking-wide text-[#332F3A]"
            >
              Study target title <span className="text-[#DB2777]">*</span>
            </label>
            <Input
              id="target_title"
              placeholder="e.g. Solve 5 Trigonometry questions"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
              }}
              required
            />
            {errors.title && (
              <p className="text-xs font-medium text-[#DB2777]">{errors.title}</p>
            )}

            {/* Quick Suggestions */}
            {!isEditMode && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {QUICK_TARGET_SUGGESTIONS.map((suggestion) => (
                  <button
                    type="button"
                    key={suggestion}
                    onClick={() => setTitle(suggestion)}
                    className="cursor-pointer rounded-full border border-white/60 bg-[#EFEBF5] px-3.5 py-1.5 font-heading text-[11px] font-extrabold text-[#635F69] shadow-clayPressed transition-all hover:-translate-y-0.5 hover:text-[#7C3AED]"
                  >
                    + {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Target Date */}
          <div className="space-y-1.5">
            <label
              htmlFor="target_date"
              className="font-heading text-xs font-extrabold uppercase tracking-wide text-[#332F3A]"
            >
              Target completion date
            </label>
            <Input
              id="target_date"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
            {errors.target_date && (
              <p className="text-xs font-medium text-[#DB2777]">
                {errors.target_date}
              </p>
            )}
          </div>

          {/* Notes / Description */}
          <div className="space-y-1.5">
            <label
              htmlFor="target_desc"
              className="font-heading text-xs font-extrabold uppercase tracking-wide text-[#332F3A]"
            >
              Notes or steps (optional)
            </label>
            <Textarea
              id="target_desc"
              placeholder="Add specific chapter page numbers or revision steps…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Saving…</span>
                </>
              ) : (
                <span>{isEditMode ? "Save changes" : "Create target"}</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
