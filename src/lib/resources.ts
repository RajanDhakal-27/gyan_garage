import { LearningItem, CreateResourceInput } from "@/types/database";

export const RESOURCE_TYPES = [
  "Notes",
  "Question Paper",
  "Video Lesson",
  "Meeting Link",
  "Reference Material",
] as const;

export type ResourceTypeOption = (typeof RESOURCE_TYPES)[number];

export interface ResourceFilterOptions {
  searchQuery?: string;
  subject?: string;
  topic?: string;
  resourceType?: string;
}

export function validateResourceInput(input: CreateResourceInput): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!input.title || input.title.trim().length === 0) {
    errors.title = "Title is required";
  } else if (input.title.trim().length < 3) {
    errors.title = "Title must be at least 3 characters";
  }

  if (input.external_url && input.external_url.trim().length > 0) {
    try {
      const url = new URL(input.external_url.trim());
      if (!["http:", "https:"].includes(url.protocol)) {
        errors.external_url = "URL must start with http:// or https://";
      }
    } catch {
      errors.external_url = "Please enter a valid URL (e.g. https://...)";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function filterResources(
  resources: LearningItem[],
  filters: ResourceFilterOptions
): LearningItem[] {
  const query = filters.searchQuery?.trim().toLowerCase() || "";
  const selectedSubject = filters.subject?.trim();
  const selectedTopic = filters.topic?.trim();
  const selectedType = filters.resourceType?.trim();

  return resources.filter((item) => {
    // Only items of type 'resource'
    if (item.item_type !== "resource") return false;

    // Subject filter
    if (selectedSubject && selectedSubject !== "All" && item.subject !== selectedSubject) {
      return false;
    }

    // Topic filter
    if (selectedTopic && selectedTopic !== "All" && item.topic !== selectedTopic) {
      return false;
    }

    // Resource type filter
    if (selectedType && selectedType !== "All" && item.resource_type !== selectedType) {
      return false;
    }

    // Search query matches title, description, topic, or subject
    if (query) {
      const titleMatch = item.title.toLowerCase().includes(query);
      const descMatch = (item.description || "").toLowerCase().includes(query);
      const topicMatch = (item.topic || "").toLowerCase().includes(query);
      const subjectMatch = (item.subject || "").toLowerCase().includes(query);
      if (!titleMatch && !descMatch && !topicMatch && !subjectMatch) {
        return false;
      }
    }

    return true;
  });
}

export function extractSubjects(resources: LearningItem[]): string[] {
  const subjects = new Set<string>();
  resources.forEach((item) => {
    if (item.item_type === "resource" && item.subject && item.subject.trim()) {
      subjects.add(item.subject.trim());
    }
  });
  return Array.from(subjects).sort();
}

export function extractTopics(
  resources: LearningItem[],
  subject?: string
): string[] {
  const topics = new Set<string>();
  resources.forEach((item) => {
    if (item.item_type === "resource" && item.topic && item.topic.trim()) {
      if (!subject || subject === "All" || item.subject === subject) {
        topics.add(item.topic.trim());
      }
    }
  });
  return Array.from(topics).sort();
}

export function getResourceBadgeColor(resourceType?: string | null): string {
  switch (resourceType?.toLowerCase()) {
    case "video lesson":
      return "bg-[#DB2777]/10 text-[#DB2777] border-[#DB2777]/20";
    case "meeting link":
      return "bg-[#0EA5E9]/10 text-[#0284C7] border-[#0EA5E9]/20";
    case "question paper":
      return "bg-[#F59E0B]/10 text-[#B45309] border-[#F59E0B]/25";
    case "notes":
      return "bg-[#10B981]/10 text-[#047857] border-[#10B981]/20";
    default:
      return "bg-[#7C3AED]/10 text-[#7C3AED] border-[#7C3AED]/20";
  }
}
