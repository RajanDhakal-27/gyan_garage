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
import { Plus, Loader2, Calendar, Target } from "lucide-react";
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
            <Button className="gap-1.5 shadow-sm">
              <Plus className="size-4" />
              <span>Add Target</span>
            </Button>
          }
        />
      ) : null}

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Study Target" : "Add Study Target"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update your study goal, scheduled target date, or notes."
              : "Set a personal study target or to-do item to track your preparation."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Title */}
          <div className="space-y-1.5">
            <label
              htmlFor="target_title"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Study Target Title <span className="text-destructive">*</span>
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
              <p className="text-xs text-destructive">{errors.title}</p>
            )}

            {/* Quick Suggestions */}
            {!isEditMode && (
              <div className="flex flex-wrap gap-1 pt-1">
                {QUICK_TARGET_SUGGESTIONS.map((suggestion) => (
                  <button
                    type="button"
                    key={suggestion}
                    onClick={() => setTitle(suggestion)}
                    className="rounded border border-muted bg-muted/40 px-1.5 py-0.5 text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
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
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Target Completion Date
            </label>
            <Input
              id="target_date"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
            {errors.target_date && (
              <p className="text-xs text-destructive">{errors.target_date}</p>
            )}
          </div>

          {/* Notes / Description */}
          <div className="space-y-1.5">
            <label
              htmlFor="target_desc"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Notes or Steps (Optional)
            </label>
            <Textarea
              id="target_desc"
              placeholder="Add specific chapter page numbers or revision steps..."
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
            <Button type="submit" disabled={isSubmitting} className="gap-1.5">
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{isEditMode ? "Save Changes" : "Create Target"}</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
