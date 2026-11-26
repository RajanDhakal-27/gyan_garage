"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { validateHomeworkInput } from "@/lib/homework";
import { LearningItem } from "@/types/database";
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

const COMMON_SUBJECTS = ["Mathematics", "Science", "English", "Social Studies", "Nepali"];

interface HomeworkFormDialogProps {
  onHomeworkSaved: () => void;
  initialData?: LearningItem | null;
  triggerButton?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function HomeworkFormDialog({
  onHomeworkSaved,
  initialData,
  triggerButton,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: HomeworkFormDialogProps) {
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
  const [subject, setSubject] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [instructions, setInstructions] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setSubject(initialData.subject || "");
      setInstructions(initialData.instructions || "");
      setDescription(initialData.description || "");

      if (initialData.due_at) {
        // Format for datetime-local: YYYY-MM-DDTHH:mm
        const d = new Date(initialData.due_at);
        const pad = (n: number) => String(n).padStart(2, "0");
        const formatted = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
          d.getDate()
        )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
        setDueAt(formatted);
      } else {
        setDueAt("");
      }
      setErrors({});
    } else {
      resetForm();
    }
  }, [initialData, open]);

  const resetForm = () => {
    setTitle("");
    setSubject("");
    setDueAt("");
    setInstructions("");
    setDescription("");
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formattedDueAt = dueAt ? new Date(dueAt).toISOString() : undefined;

    const validation = validateHomeworkInput({
      title,
      subject,
      instructions,
      description,
      due_at: formattedDueAt,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors({});

      if (isEditMode && initialData) {
        const { error } = await supabase
          .from("learning_items")
          .update({
            title: title.trim(),
            subject: subject.trim() || null,
            instructions: instructions.trim() || null,
            description: description.trim() || null,
            due_at: formattedDueAt || null,
          })
          .eq("id", initialData.id);

        if (error) throw error;
        toast.success("Homework assignment updated successfully!");
      } else {
        const { error } = await supabase.from("learning_items").insert({
          item_type: "homework",
          title: title.trim(),
          subject: subject.trim() || null,
          instructions: instructions.trim() || null,
          description: description.trim() || null,
          due_at: formattedDueAt || null,
        });

        if (error) throw error;
        toast.success("Homework assigned successfully!");
      }

      resetForm();
      setOpen(false);
      onHomeworkSaved();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to save homework assignment.";
      toast.error(message);
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
              <span>Create homework</span>
            </Button>
          }
        />
      ) : null}

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit homework assignment" : "Assign new homework"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update assignment directions, deadlines or subject details."
              : "Post homework with directions and a submission due date for students."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Title */}
          <div className="space-y-1.5">
            <label
              htmlFor="hw_title"
              className="font-heading text-xs font-extrabold uppercase tracking-wide text-[#332F3A]"
            >
              Assignment title <span className="text-[#DB2777]">*</span>
            </label>
            <Input
              id="hw_title"
              placeholder="e.g. Unit 4 Physics Problem Set"
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
          </div>

          {/* Subject & Quick Chips */}
          <div className="space-y-1.5">
            <label
              htmlFor="hw_subject"
              className="font-heading text-xs font-extrabold uppercase tracking-wide text-[#332F3A]"
            >
              Subject
            </label>
            <Input
              id="hw_subject"
              placeholder="e.g. Mathematics, Science"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <div className="flex flex-wrap gap-1 pt-1">
              {COMMON_SUBJECTS.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setSubject(s)}
                  className="cursor-pointer rounded-full border border-white/60 bg-[#EFEBF5] px-3.5 py-1.5 font-heading text-[11px] font-extrabold text-[#635F69] shadow-clayPressed transition-all hover:-translate-y-0.5 hover:text-[#7C3AED]"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Due Date & Time */}
          <div className="space-y-1.5">
            <label
              htmlFor="hw_due_at"
              className="font-heading text-xs font-extrabold uppercase tracking-wide text-[#332F3A]"
            >
              Submission Due Date & Time
            </label>
            <Input
              id="hw_due_at"
              type="datetime-local"
              value={dueAt}
              onChange={(e) => {
                setDueAt(e.target.value);
                if (errors.due_at) setErrors((prev) => ({ ...prev, due_at: "" }));
              }}
            />
            {errors.due_at && (
              <p className="text-xs font-medium text-[#DB2777]">{errors.due_at}</p>
            )}
          </div>

          {/* Instructions */}
          <div className="space-y-1.5">
            <label
              htmlFor="hw_instructions"
              className="font-heading text-xs font-extrabold uppercase tracking-wide text-[#332F3A]"
            >
              Detailed Instructions & Questions
            </label>
            <Textarea
              id="hw_instructions"
              placeholder="Enter textbook page numbers, exercises, or step-by-step directions for students..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={4}
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label
              htmlFor="hw_desc"
              className="font-heading text-xs font-extrabold uppercase tracking-wide text-[#332F3A]"
            >
              Brief Description (Optional)
            </label>
            <Input
              id="hw_desc"
              placeholder="e.g. Chapter 4 review exercises"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
                  <span>{isEditMode ? "Saving…" : "Assigning…"}</span>
                </>
              ) : (
                <span>{isEditMode ? "Save changes" : "Post homework"}</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
