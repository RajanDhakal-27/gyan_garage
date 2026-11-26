"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  RESOURCE_TYPES,
  ResourceTypeOption,
  validateResourceInput,
} from "@/lib/resources";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

const COMMON_SUBJECTS = ["Mathematics", "Science", "English", "Social Studies", "Nepali"];

interface ResourceFormDialogProps {
  onResourceSaved: () => void;
  initialData?: LearningItem | null;
  triggerButton?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ResourceFormDialog({
  onResourceSaved,
  initialData,
  triggerButton,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: ResourceFormDialogProps) {
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
  const [resourceType, setResourceType] = useState<ResourceTypeOption>("Notes");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setResourceType((initialData.resource_type as ResourceTypeOption) || "Notes");
      setSubject(initialData.subject || "");
      setTopic(initialData.topic || "");
      setExternalUrl(initialData.external_url || "");
      setDescription(initialData.description || "");
      setErrors({});
    } else {
      setTitle("");
      setResourceType("Notes");
      setSubject("");
      setTopic("");
      setExternalUrl("");
      setDescription("");
      setErrors({});
    }
  }, [initialData, open]);

  const resetForm = () => {
    setTitle("");
    setResourceType("Notes");
    setSubject("");
    setTopic("");
    setExternalUrl("");
    setDescription("");
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateResourceInput({
      title,
      external_url: externalUrl,
      resource_type: resourceType,
      subject,
      topic,
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
            resource_type: resourceType,
            subject: subject.trim() || null,
            topic: topic.trim() || null,
            external_url: externalUrl.trim() || null,
            description: description.trim() || null,
          })
          .eq("id", initialData.id);

        if (error) throw error;
        toast.success("Resource updated successfully!");
      } else {
        const { error } = await supabase.from("learning_items").insert({
          item_type: "resource",
          title: title.trim(),
          resource_type: resourceType,
          subject: subject.trim() || null,
          topic: topic.trim() || null,
          external_url: externalUrl.trim() || null,
          description: description.trim() || null,
        });

        if (error) throw error;
        toast.success("Resource published successfully!");
      }

      resetForm();
      setOpen(false);
      onResourceSaved();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to save resource.";
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
              <span>Add resource</span>
            </Button>
          }
        />
      ) : null}

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit learning resource" : "Add learning resource"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update resource details, subject tags or external links."
              : "Publish notes, question papers, video lessons or online meeting links."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Title */}
          <div className="space-y-1.5">
            <label
              htmlFor="title"
              className="font-heading text-xs font-extrabold uppercase tracking-wide text-[#332F3A]"
            >
              Title <span className="text-[#DB2777]">*</span>
            </label>
            <Input
              id="title"
              placeholder="e.g. Class 10 Opt Math Notes - Trigonometry"
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

          {/* Resource Type */}
          <div className="space-y-1.5">
            <label
              htmlFor="resource_type"
              className="font-heading text-xs font-extrabold uppercase tracking-wide text-[#332F3A]"
            >
              Resource Type
            </label>
            <Select
              value={resourceType}
              onValueChange={(val) => {
                if (val) setResourceType(val as ResourceTypeOption);
              }}
            >
              <SelectTrigger id="resource_type" className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {RESOURCE_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subject & Quick Chips */}
          <div className="space-y-1.5">
            <label
              htmlFor="subject"
              className="font-heading text-xs font-extrabold uppercase tracking-wide text-[#332F3A]"
            >
              Subject
            </label>
            <Input
              id="subject"
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

          {/* Topic */}
          <div className="space-y-1.5">
            <label
              htmlFor="topic"
              className="font-heading text-xs font-extrabold uppercase tracking-wide text-[#332F3A]"
            >
              Topic / Chapter
            </label>
            <Input
              id="topic"
              placeholder="e.g. Trigonometry, Optics, Organic Chemistry"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          {/* External URL */}
          <div className="space-y-1.5">
            <label
              htmlFor="external_url"
              className="font-heading text-xs font-extrabold uppercase tracking-wide text-[#332F3A]"
            >
              External URL
            </label>
            <Input
              id="external_url"
              type="url"
              placeholder="https://drive.google.com/..., https://youtube.com/..."
              value={externalUrl}
              onChange={(e) => {
                setExternalUrl(e.target.value);
                if (errors.external_url) {
                  setErrors((prev) => ({ ...prev, external_url: "" }));
                }
              }}
            />
            {errors.external_url && (
              <p className="text-xs font-medium text-[#DB2777]">
                {errors.external_url}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label
              htmlFor="description"
              className="font-heading text-xs font-extrabold uppercase tracking-wide text-[#332F3A]"
            >
              Description & Notes
            </label>
            <Textarea
              id="description"
              placeholder="Add key highlights, page references, or meeting instructions..."
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
                  <span>{isEditMode ? "Saving…" : "Publishing…"}</span>
                </>
              ) : (
                <span>{isEditMode ? "Save changes" : "Publish resource"}</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
