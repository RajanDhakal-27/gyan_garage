"use client";

import React, { useState } from "react";
import { LearningItem } from "@/types/database";
import { useRole } from "@/context/role-context";
import { getResourceBadgeColor } from "@/lib/resources";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Trash2,
  Pencil,
  FileText,
  Video,
  FileQuestion,
  BookOpen,
  Calendar,
  Loader2,
  Eye,
} from "lucide-react";
import { cn } from "cn";

interface ResourceCardProps {
  resource: LearningItem;
  onDelete?: (id: string) => Promise<void>;
  onEdit?: (resource: LearningItem) => void;
  onViewDetails?: (resource: LearningItem) => void;
}

function ResourceIcon({
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

export function ResourceCard({
  resource,
  onDelete,
  onEdit,
  onViewDetails,
}: ResourceCardProps) {
  const { isTeacher } = useRole();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onDelete) return;
    const confirmed = window.confirm(
      `Are you sure you want to delete "${resource.title}"?`
    );
    if (!confirmed) return;

    try {
      setIsDeleting(true);
      await onDelete(resource.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const formattedDate = new Date(resource.created_at).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Card className="flex flex-col justify-between">
      <CardHeader className="space-y-3 pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {resource.resource_type && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-3 py-1 font-heading text-[11px] font-extrabold",
                  getResourceBadgeColor(resource.resource_type)
                )}
              >
                <ResourceIcon resource={resource} className="size-3.5" />
                {resource.resource_type}
              </span>
            )}
            {resource.subject && <Badge variant="secondary">{resource.subject}</Badge>}
            {resource.topic && <Badge variant="outline">{resource.topic}</Badge>}
          </div>

          {isTeacher && (
            <div className="flex items-center gap-1">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(resource);
                  }}
                  title="Edit resource"
                  aria-label={`Edit ${resource.title}`}
                >
                  <Pencil className="size-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-[#635F69] hover:bg-[#DB2777]/10 hover:text-[#DB2777]"
                  title="Delete resource"
                  aria-label={`Delete ${resource.title}`}
                >
                  {isDeleting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Trash2 className="size-4" />
                  )}
                </Button>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => onViewDetails?.(resource)}
          className="group text-left text-[#332F3A]"
        >
          <CardTitle className="line-clamp-2 text-lg font-extrabold leading-snug transition-colors group-hover:text-[#7C3AED]">
            {resource.title}
          </CardTitle>
        </button>
      </CardHeader>

      <CardContent className="pb-4">
        {resource.description ? (
          <p className="line-clamp-3 text-sm leading-relaxed text-[#635F69]">
            {resource.description}
          </p>
        ) : (
          <p className="text-sm italic text-[#635F69]/80">
            No additional description provided.
          </p>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-4 pb-5">
        <div className="flex items-center gap-1.5 text-[11px] text-[#635F69]">
          <Calendar className="size-3.5" />
          <span>{formattedDate}</span>
        </div>

        <div className="flex items-center gap-1.5">
          {onViewDetails && (
            <Button
              variant="ghost"
              size="xs"
              onClick={() => onViewDetails(resource)}
            >
              <Eye className="size-3.5" />
              <span>Details</span>
            </Button>
          )}

          {resource.external_url ? (
            <a
              href={resource.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#7C3AED]/10 px-4 py-2 font-heading text-xs font-extrabold text-[#7C3AED] transition-colors hover:bg-[#7C3AED]/15"
            >
              <span>Open</span>
              <ExternalLink className="size-3.5" />
            </a>
          ) : (
            <span className="text-xs text-[#635F69]/70">No link</span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
