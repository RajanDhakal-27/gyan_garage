"use client";

import React from "react";
import { LearningItem } from "@/types/database";
import { getResourceBadgeColor } from "@/lib/resources";
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
  ExternalLink,
  Calendar,
  FileText,
  Video,
  FileQuestion,
  BookOpen,
} from "lucide-react";
import { cn } from "cn";

interface ResourceDetailDialogProps {
  resource: LearningItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ResourceDetailDialog({
  resource,
  open,
  onOpenChange,
}: ResourceDetailDialogProps) {
  if (!resource) return null;

  const getIcon = () => {
    const type = resource.resource_type?.toLowerCase() || "";
    const url = resource.external_url?.toLowerCase() || "";
    if (type.includes("video") || url.includes("youtube.com") || url.includes("youtu.be")) {
      return Video;
    }
    if (type.includes("meeting") || url.includes("zoom.us") || url.includes("meet.google.com")) {
      return Video;
    }
    if (type.includes("question") || type.includes("paper")) {
      return FileQuestion;
    }
    if (type.includes("note")) {
      return FileText;
    }
    return BookOpen;
  };

  const Icon = getIcon();

  const formattedDate = new Date(resource.created_at).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {resource.resource_type && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium",
                  getResourceBadgeColor(resource.resource_type)
                )}
              >
                <Icon className="size-3" />
                {resource.resource_type}
              </span>
            )}
            {resource.subject && (
              <Badge variant="secondary" className="text-xs">
                {resource.subject}
              </Badge>
            )}
            {resource.topic && (
              <Badge variant="outline" className="text-xs text-muted-foreground">
                {resource.topic}
              </Badge>
            )}
          </div>

          <DialogTitle className="text-lg font-bold leading-snug">
            {resource.title}
          </DialogTitle>

          <DialogDescription className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="size-3" />
            <span>Added on {formattedDate}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {resource.description ? (
            <div className="rounded-lg bg-muted/40 p-3 text-sm leading-relaxed text-foreground whitespace-pre-wrap">
              {resource.description}
            </div>
          ) : (
            <p className="text-xs italic text-muted-foreground">
              No description was provided for this resource.
            </p>
          )}

          {resource.external_url && (
            <div className="rounded-lg border p-3 bg-card space-y-1.5">
              <span className="text-xs font-medium text-muted-foreground block">
                Resource Link:
              </span>
              <a
                href={resource.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline break-all inline-flex items-center gap-1"
              >
                <span>{resource.external_url}</span>
                <ExternalLink className="size-3 shrink-0" />
              </a>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>

          {resource.external_url ? (
            <a
              href={resource.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90"
            >
              <span>Open Resource</span>
              <ExternalLink className="size-4" />
            </a>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
