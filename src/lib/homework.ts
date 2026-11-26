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
        "bg-[#EFEBF5] text-[#635F69] border-white/60",
    };
  }

  const dueDate = new Date(due_at);
  if (isNaN(dueDate.getTime())) {
    return {
      status: "no_due_date",
      label: "Invalid date",
      badgeClassName:
        "bg-[#EFEBF5] text-[#635F69] border-white/60",
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
        "bg-[#0EA5E9]/10 text-[#0284C7] border-[#0EA5E9]/20",
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
        "bg-[#DB2777]/10 text-[#DB2777] border-[#DB2777]/25",
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
        "bg-[#F59E0B]/10 text-[#B45309] border-[#F59E0B]/25",
    };
  }

  // Tomorrow or within 48h
  if (diffDays === 1) {
    return {
      status: "due_soon",
      label: "Due Tomorrow",
      badgeClassName:
        "bg-[#F59E0B]/10 text-[#B45309] border-[#F59E0B]/25",
    };
  }

  if (diffDays <= 3) {
    return {
      status: "due_soon",
      label: `Due in ${diffDays} days`,
      badgeClassName:
        "bg-[#0EA5E9]/10 text-[#0284C7] border-[#0EA5E9]/20",
    };
  }

  return {
    status: "upcoming",
    label: `Due in ${diffDays} days`,
    badgeClassName:
      "bg-[#10B981]/10 text-[#047857] border-[#10B981]/20",
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
