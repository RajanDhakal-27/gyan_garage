import { LearningItem, CreateHomeworkInput } from "@/types/database";

export interface DueStatusInfo {
  status: "overdue" | "due_today" | "due_soon" | "upcoming" | "no_due_date";
  label: string;
  badgeClassName: string;
}

export function validateHomeworkInput(input: CreateHomeworkInput): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!input.title || input.title.trim().length === 0) {
    errors.title = "Assignment title is required";
  } else if (input.title.trim().length < 3) {
    errors.title = "Title must be at least 3 characters";
  }

  if (input.due_at && input.due_at.trim().length > 0) {
    const parsed = new Date(input.due_at);
    if (isNaN(parsed.getTime())) {
      errors.due_at = "Please provide a valid deadline date";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function getDueStatus(
  due_at: string | null | undefined,
  now?: Date
): DueStatusInfo {
  if (!due_at) {
    return {
      status: "no_due_date",
      label: "No due date",
      badgeClassName:
        "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700",
    };
  }

  const dueDate = new Date(due_at);
  if (isNaN(dueDate.getTime())) {
    return {
      status: "no_due_date",
      label: "Invalid date",
      badgeClassName:
        "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700",
    };
  }

  if (!now) {
    return {
      status: "upcoming",
      label: `Due ${dueDate.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })}`,
      badgeClassName:
        "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-900",
    };
  }

  const diffMs = dueDate.getTime() - now.getTime();
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffMs < 0) {
    const overdueDays = Math.abs(diffDays) || 1;
    return {
      status: "overdue",
      label: overdueDays === 1 ? "Overdue (Yesterday)" : `Overdue by ${overdueDays}d`,
      badgeClassName:
        "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300 border-red-200 dark:border-red-900",
    };
  }

  // Same calendar day or < 24h
  if (
    dueDate.getFullYear() === now.getFullYear() &&
    dueDate.getMonth() === now.getMonth() &&
    dueDate.getDate() === now.getDate()
  ) {
    return {
      status: "due_today",
      label: diffHours > 0 ? `Due Today (${diffHours}h left)` : "Due Today",
      badgeClassName:
        "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-900",
    };
  }

  // Tomorrow or within 48h
  if (diffDays === 1) {
    return {
      status: "due_soon",
      label: "Due Tomorrow",
      badgeClassName:
        "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-900",
    };
  }

  if (diffDays <= 3) {
    return {
      status: "due_soon",
      label: `Due in ${diffDays} days`,
      badgeClassName:
        "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-900",
    };
  }

  return {
    status: "upcoming",
    label: `Due in ${diffDays} days`,
    badgeClassName:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900",
  };
}

export interface HomeworkFilterOptions {
  searchQuery?: string;
  subject?: string;
  statusFilter?: "all" | "pending" | "overdue";
  now?: Date;
}

export function filterAndSortHomework(
  items: LearningItem[],
  options: HomeworkFilterOptions = {}
): LearningItem[] {
  const query = options.searchQuery?.trim().toLowerCase() || "";
  const selectedSubject = options.subject?.trim();
  const statusFilter = options.statusFilter || "all";
  const now = options.now;

  const filtered = items.filter((item) => {
    if (item.item_type !== "homework") return false;

    if (selectedSubject && selectedSubject !== "All" && item.subject !== selectedSubject) {
      return false;
    }

    if (query) {
      const titleMatch = item.title.toLowerCase().includes(query);
      const subjectMatch = (item.subject || "").toLowerCase().includes(query);
      const instructionsMatch = (item.instructions || "").toLowerCase().includes(query);
      const descMatch = (item.description || "").toLowerCase().includes(query);
      if (!titleMatch && !subjectMatch && !instructionsMatch && !descMatch) {
        return false;
      }
    }

    if (statusFilter !== "all" && now) {
      const dueInfo = getDueStatus(item.due_at, now);
      if (statusFilter === "overdue" && dueInfo.status !== "overdue") {
        return false;
      }
      if (statusFilter === "pending" && dueInfo.status === "overdue") {
        return false;
      }
    }

    return true;
  });

  // Sort: upcoming nearest first, then overdue, then no deadline
  return filtered.sort((a, b) => {
    if (!a.due_at && !b.due_at) return 0;
    if (!a.due_at) return 1;
    if (!b.due_at) return -1;
    return new Date(a.due_at).getTime() - new Date(b.due_at).getTime();
  });
}

export function extractHomeworkSubjects(items: LearningItem[]): string[] {
  const subjects = new Set<string>();
  items.forEach((item) => {
    if (item.item_type === "homework" && item.subject && item.subject.trim()) {
      subjects.add(item.subject.trim());
    }
  });
  return Array.from(subjects).sort();
}
