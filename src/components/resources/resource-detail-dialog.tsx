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

function ResourceTypeIcon({
  resource,
  className,
}: {
  resource: LearningItem;
  className?: string;
}) {
  const type = resource.resource_type?.toLowerCase() || "";
  const url = resource.external_url?.toLowerCase() || "";
  if (
    type.includes("video") ||
    url.includes("youtube.com") ||
    url.includes("youtu.be")
  ) {
    return <Video className={className} />;
  }
  if (
    type.includes("meeting") ||
    url.includes("zoom.us") ||
    url.includes("meet.google.com")
  ) {
    return <Video className={className} />;
  }
  if (type.includes("question") || type.includes("paper")) {
    return <FileQuestion className={className} />;
  }
  if (type.includes("note")) {
    return <FileText className={className} />;
  }
  return <BookOpen className={className} />;
}

export function ResourceDetailDialog({
  resource,
  open,
  onOpenChange,
}: ResourceDetailDialogProps) {
  if (!resource) return null;

  const formattedDate = new Date(resource.created_at).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="space-y-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {resource.resource_type && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-3 py-1 font-heading text-[11px] font-extrabold",
                  getResourceBadgeColor(resource.resource_type)
                )}
              >
                <ResourceTypeIcon resource={resource} className="size-3.5" />
                {resource.resource_type}
              </span>
            )}
            {resource.subject && <Badge variant="secondary">{resource.subject}</Badge>}
            {resource.topic && <Badge variant="outline">{resource.topic}</Badge>}
          </div>

          <DialogTitle className="text-xl font-extrabold leading-snug">
            {resource.title}
          </DialogTitle>

          <DialogDescription className="flex items-center gap-1.5 text-xs text-[#635F69]">
            <Calendar className="size-3.5" />
            <span>Added on {formattedDate}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {resource.description ? (
            <div className="whitespace-pre-wrap rounded-3xl bg-[#EFEBF5] p-5 text-sm leading-relaxed text-[#332F3A] shadow-clayPressed">
              {resource.description}
            </div>
          ) : (
            <p className="text-sm italic text-[#635F69]">
              No description was provided for this resource.
            </p>
          )}

          {resource.external_url && (
            <div className="space-y-1.5 rounded-3xl border border-white/70 bg-white/60 p-4 shadow-clayCard">
              <span className="block font-heading text-xs font-extrabold uppercase tracking-wide text-[#635F69]">
                Resource link
              </span>
              <a
                href={resource.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 break-all text-xs text-[#7C3AED] hover:underline"
              >
                <span>{resource.external_url}</span>
                <ExternalLink className="size-3.5 shrink-0" />
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
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] px-6 py-3.5 font-heading text-sm font-extrabold text-white shadow-clayButton transition-all duration-200 hover:-translate-y-0.5 hover:shadow-clayButtonHover active:scale-[0.95]"
            >
              <span>Open resource</span>
              <ExternalLink className="size-4" />
            </a>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
