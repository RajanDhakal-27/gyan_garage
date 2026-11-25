import { StudyTask, CreateStudyTaskInput } from "@/types/database";

export interface PlannerMetrics {
  total: number;
  completed: number;
  pending: number;
  percentage: number;
}

export function calculatePlannerMetrics(tasks: StudyTask[]): PlannerMetrics {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.is_completed).length;
  const pending = total - completed;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    completed,
    pending,
    percentage,
  };
}

export function validateStudyTaskInput(input: CreateStudyTaskInput): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!input.title || input.title.trim().length === 0) {
    errors.title = "Target title is required";
  } else if (input.title.trim().length < 2) {
    errors.title = "Title must be at least 2 characters";
  }

  if (input.target_date && input.target_date.trim().length > 0) {
    const parsed = new Date(input.target_date);
    if (isNaN(parsed.getTime())) {
      errors.target_date = "Please provide a valid target date";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export interface TargetDateStatus {
  label: string;
  badgeClass: string;
  isOverdue: boolean;
}

export function formatTargetDate(
  target_date: string | null | undefined,
  now?: Date
): TargetDateStatus {
  if (!target_date) {
    return {
      label: "No date set",
      badgeClass: "text-muted-foreground bg-muted/40 border-muted",
      isOverdue: false,
    };
  }

  const target = new Date(target_date);
  if (isNaN(target.getTime())) {
    return {
      label: "Invalid date",
      badgeClass: "text-muted-foreground bg-muted/40 border-muted",
      isOverdue: false,
    };
  }

  const formattedMonthDay = target.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

  if (!now) {
    return {
      label: formattedMonthDay,
      badgeClass: "text-muted-foreground bg-muted/40 border-muted",
      isOverdue: false,
    };
  }

  const nowDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDateOnly = new Date(
    target.getFullYear(),
    target.getMonth(),
    target.getDate()
  );

  const diffMs = targetDateOnly.getTime() - nowDateOnly.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const overdueDays = Math.abs(diffDays);
    return {
      label: overdueDays === 1 ? "Overdue (Yesterday)" : `Overdue by ${overdueDays}d`,
      badgeClass:
        "border-red-200 bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800",
      isOverdue: true,
    };
  }

  if (diffDays === 0) {
    return {
      label: "Target: Today",
      badgeClass:
        "border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800 font-medium",
      isOverdue: false,
    };
  }

  if (diffDays === 1) {
    return {
      label: "Target: Tomorrow",
      badgeClass:
        "border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800 font-medium",
      isOverdue: false,
    };
  }

  return {
    label: formattedMonthDay,
    badgeClass:
      "border-border bg-card text-foreground dark:border-zinc-800",
    isOverdue: false,
  };
}

export interface TaskFilterOptions {
  statusFilter?: "all" | "pending" | "completed";
  searchQuery?: string;
}

export function filterAndSortStudyTasks(
  tasks: StudyTask[],
  options: TaskFilterOptions = {}
): StudyTask[] {
  const query = options.searchQuery?.trim().toLowerCase() || "";
  const statusFilter = options.statusFilter || "all";

  const filtered = tasks.filter((t) => {
    if (statusFilter === "pending" && t.is_completed) return false;
    if (statusFilter === "completed" && !t.is_completed) return false;

    if (query) {
      const titleMatch = t.title.toLowerCase().includes(query);
      const descMatch = (t.description || "").toLowerCase().includes(query);
      if (!titleMatch && !descMatch) return false;
    }

    return true;
  });

  return filtered.sort((a, b) => {
    // Pending tasks come first
    if (a.is_completed !== b.is_completed) {
      return a.is_completed ? 1 : -1;
    }

    // Sort by target_date ascending
    if (a.target_date && b.target_date) {
      return new Date(a.target_date).getTime() - new Date(b.target_date).getTime();
    }
    if (a.target_date) return -1;
    if (b.target_date) return 1;

    // Otherwise newest created first
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}
