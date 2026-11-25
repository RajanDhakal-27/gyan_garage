import { describe, it, expect } from "vitest";
import {
  calculatePlannerMetrics,
  validateStudyTaskInput,
  formatTargetDate,
  filterAndSortStudyTasks,
} from "./study-planner";
import { StudyTask } from "@/types/database";

describe("calculatePlannerMetrics", () => {
  it("calculates accurate statistics", () => {
    const tasks: StudyTask[] = [
      {
        id: "1",
        title: "T1",
        description: null,
        target_date: null,
        is_completed: true,
        created_at: "",
      },
      {
        id: "2",
        title: "T2",
        description: null,
        target_date: null,
        is_completed: false,
        created_at: "",
      },
      {
        id: "3",
        title: "T3",
        description: null,
        target_date: null,
        is_completed: true,
        created_at: "",
      },
      {
        id: "4",
        title: "T4",
        description: null,
        target_date: null,
        is_completed: false,
        created_at: "",
      },
    ];

    const metrics = calculatePlannerMetrics(tasks);
    expect(metrics.total).toBe(4);
    expect(metrics.completed).toBe(2);
    expect(metrics.pending).toBe(2);
    expect(metrics.percentage).toBe(50);
  });

  it("handles zero tasks cleanly", () => {
    const metrics = calculatePlannerMetrics([]);
    expect(metrics.total).toBe(0);
    expect(metrics.completed).toBe(0);
    expect(metrics.percentage).toBe(0);
  });
});

describe("validateStudyTaskInput", () => {
  it("rejects empty title", () => {
    const res = validateStudyTaskInput({ title: "" });
    expect(res.isValid).toBe(false);
    expect(res.errors.title).toBeDefined();
  });

  it("rejects invalid date", () => {
    const res = validateStudyTaskInput({
      title: "Valid title",
      target_date: "invalid-date",
    });
    expect(res.isValid).toBe(false);
    expect(res.errors.target_date).toBeDefined();
  });

  it("accepts valid input", () => {
    const res = validateStudyTaskInput({
      title: "Revise Opt Math proofs",
      target_date: "2026-11-28",
      description: "Exercise 14.2",
    });
    expect(res.isValid).toBe(true);
    expect(Object.keys(res.errors).length).toBe(0);
  });
});

describe("formatTargetDate", () => {
  const fixedNow = new Date("2026-11-25T12:00:00Z");

  it("identifies Today", () => {
    const res = formatTargetDate("2026-11-25", fixedNow);
    expect(res.label).toBe("Target: Today");
    expect(res.isOverdue).toBe(false);
  });

  it("identifies Tomorrow", () => {
    const res = formatTargetDate("2026-11-26", fixedNow);
    expect(res.label).toBe("Target: Tomorrow");
    expect(res.isOverdue).toBe(false);
  });

  it("identifies Overdue", () => {
    const res = formatTargetDate("2026-11-23", fixedNow);
    expect(res.label).toContain("Overdue");
    expect(res.isOverdue).toBe(true);
  });

  it("handles null safely", () => {
    const res = formatTargetDate(null, fixedNow);
    expect(res.label).toBe("No date set");
  });
});

describe("filterAndSortStudyTasks", () => {
  const tasks: StudyTask[] = [
    {
      id: "1",
      title: "Completed Task",
      description: null,
      target_date: "2026-11-20",
      is_completed: true,
      created_at: "2026-11-10",
    },
    {
      id: "2",
      title: "Pending Math Task",
      description: "Formula practice",
      target_date: "2026-11-26",
      is_completed: false,
      created_at: "2026-11-12",
    },
    {
      id: "3",
      title: "Pending Science Task",
      description: "Gravitation notes",
      target_date: "2026-11-24", // Earlier pending
      is_completed: false,
      created_at: "2026-11-14",
    },
  ];

  it("filters by status pending", () => {
    const res = filterAndSortStudyTasks(tasks, { statusFilter: "pending" });
    expect(res).toHaveLength(2);
    expect(res.every((t) => !t.is_completed)).toBe(true);
  });

  it("filters by status completed", () => {
    const res = filterAndSortStudyTasks(tasks, { statusFilter: "completed" });
    expect(res).toHaveLength(1);
    expect(res[0].title).toBe("Completed Task");
  });

  it("sorts pending first, then by earliest target_date", () => {
    const res = filterAndSortStudyTasks(tasks, { statusFilter: "all" });
    expect(res[0].id).toBe("3"); // Nov 24 pending
    expect(res[1].id).toBe("2"); // Nov 26 pending
    expect(res[2].id).toBe("1"); // Completed task at bottom
  });

  it("searches across title and description", () => {
    const res = filterAndSortStudyTasks(tasks, { searchQuery: "Formula" });
    expect(res).toHaveLength(1);
    expect(res[0].title).toBe("Pending Math Task");
  });
});
