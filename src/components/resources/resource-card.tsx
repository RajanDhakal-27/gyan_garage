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

export function ResourceCard({
  resource,
  onDelete,
  onEdit,
  onViewDetails,
}: ResourceCardProps) {
  const { isTeacher } = useRole();
  const [isDeleting, setIsDeleting] = useState(false);

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
    <Card className="flex flex-col justify-between transition-all hover:shadow-md border border-border/80">
      <CardHeader className="space-y-2 pb-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
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
                  className="text-muted-foreground hover:text-foreground hover:bg-muted"
                  title="Edit resource"
                  aria-label={`Edit ${resource.title}`}
                >
                  <Pencil className="size-3.5" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  title="Delete resource"
                  aria-label={`Delete ${resource.title}`}
                >
                  {isDeleting ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="size-3.5" />
                  )}
                </Button>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => onViewDetails?.(resource)}
          className="text-left group text-foreground"
        >
          <CardTitle className="text-base font-semibold leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {resource.title}
          </CardTitle>
        </button>
      </CardHeader>

      <CardContent className="pb-4">
        {resource.description ? (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {resource.description}
          </p>
        ) : (
          <p className="text-xs italic text-muted-foreground/60">
            No additional description provided.
          </p>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t bg-muted/20 pt-3 pb-3">
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <Calendar className="size-3" />
          <span>{formattedDate}</span>
        </div>

        <div className="flex items-center gap-1.5">
          {onViewDetails && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails(resource)}
              className="h-7 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground"
            >
              <Eye className="size-3" />
              <span>Details</span>
            </Button>
          )}

          {resource.external_url ? (
            <a
              href={resource.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-lg border bg-background px-2.5 py-1 text-xs font-medium text-foreground shadow-xs transition-colors hover:bg-muted"
            >
              <span>Open</span>
              <ExternalLink className="size-3 text-muted-foreground" />
            </a>
          ) : (
            <span className="text-xs text-muted-foreground/50">No link</span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
