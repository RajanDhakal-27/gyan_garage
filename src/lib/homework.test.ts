import { describe, it, expect } from "vitest";
import {
  validateHomeworkInput,
  getDueStatus,
  filterAndSortHomework,
  extractHomeworkSubjects,
} from "./homework";
import { LearningItem } from "@/types/database";

describe("validateHomeworkInput", () => {
  it("rejects empty title", () => {
    const res = validateHomeworkInput({ title: "" });
    expect(res.isValid).toBe(false);
    expect(res.errors.title).toBeDefined();
  });

  it("rejects title shorter than 3 characters", () => {
    const res = validateHomeworkInput({ title: "HW" });
    expect(res.isValid).toBe(false);
    expect(res.errors.title).toContain("at least 3 characters");
  });

  it("rejects invalid date", () => {
    const res = validateHomeworkInput({
      title: "Math HW 1",
      due_at: "not-a-date",
    });
    expect(res.isValid).toBe(false);
    expect(res.errors.due_at).toBeDefined();
  });

  it("accepts valid homework input", () => {
    const res = validateHomeworkInput({
      title: "Unit 4 Physics Problem Set",
      subject: "Science",
      instructions: "Solve problems 1-10 on page 45.",
      due_at: new Date(Date.now() + 86400000).toISOString(),
    });
    expect(res.isValid).toBe(true);
    expect(Object.keys(res.errors).length).toBe(0);
  });
});

describe("getDueStatus", () => {
  const fixedNow = new Date("2026-11-25T12:00:00Z");

  it("handles null or empty due_at", () => {
    const res = getDueStatus(null, fixedNow);
    expect(res.status).toBe("no_due_date");
    expect(res.label).toBe("No due date");
  });

  it("marks past dates as overdue", () => {
    const yesterday = new Date("2026-11-24T10:00:00Z").toISOString();
    const res = getDueStatus(yesterday, fixedNow);
    expect(res.status).toBe("overdue");
    expect(res.label).toContain("Overdue");
  });

  it("marks same-day dates as due today", () => {
    const laterToday = new Date("2026-11-25T18:00:00Z").toISOString();
    const res = getDueStatus(laterToday, fixedNow);
    expect(res.status).toBe("due_today");
    expect(res.label).toContain("Due Today");
  });

  it("marks future dates as upcoming", () => {
    const fiveDaysLater = new Date("2026-11-30T12:00:00Z").toISOString();
    const res = getDueStatus(fiveDaysLater, fixedNow);
    expect(res.status).toBe("upcoming");
    expect(res.label).toBe("Due in 5 days");
  });
});

describe("filterAndSortHomework", () => {
  const fixedNow = new Date("2026-11-25T12:00:00Z");

  const sampleHomework: LearningItem[] = [
    {
      id: "1",
      item_type: "homework",
      title: "Math Problem Set",
      description: "Trig homework",
      resource_type: null,
      subject: "Mathematics",
      topic: null,
      external_url: null,
      instructions: "Solve page 20 Q1-Q5",
      due_at: "2026-11-28T12:00:00Z", // 3 days later
      created_at: "2026-11-20T10:00:00Z",
    },
    {
      id: "2",
      item_type: "homework",
      title: "Science Lab Report",
      description: "Gravitation experiment",
      resource_type: null,
      subject: "Science",
      topic: null,
      external_url: null,
      instructions: "Write hypothesis and observation",
      due_at: "2026-11-23T12:00:00Z", // Overdue
      created_at: "2026-11-19T10:00:00Z",
    },
    {
      id: "3",
      item_type: "resource", // should be filtered out
      title: "Not Homework",
      description: null,
      resource_type: "Notes",
      subject: "Mathematics",
      topic: null,
      external_url: null,
      instructions: null,
      due_at: null,
      created_at: "2026-11-20T10:00:00Z",
    },
  ];

  it("excludes non-homework items", () => {
    const res = filterAndSortHomework(sampleHomework, { now: fixedNow });
    expect(res).toHaveLength(2);
    expect(res.every((i) => i.item_type === "homework")).toBe(true);
  });

  it("filters by subject", () => {
    const res = filterAndSortHomework(sampleHomework, {
      subject: "Science",
      now: fixedNow,
    });
    expect(res).toHaveLength(1);
    expect(res[0].title).toBe("Science Lab Report");
  });

  it("filters by status overdue", () => {
    const res = filterAndSortHomework(sampleHomework, {
      statusFilter: "overdue",
      now: fixedNow,
    });
    expect(res).toHaveLength(1);
    expect(res[0].title).toBe("Science Lab Report");
  });

  it("filters by status pending", () => {
    const res = filterAndSortHomework(sampleHomework, {
      statusFilter: "pending",
      now: fixedNow,
    });
    expect(res).toHaveLength(1);
    expect(res[0].title).toBe("Math Problem Set");
  });

  it("searches across instructions and title", () => {
    const res = filterAndSortHomework(sampleHomework, {
      searchQuery: "hypothesis",
      now: fixedNow,
    });
    expect(res).toHaveLength(1);
    expect(res[0].title).toBe("Science Lab Report");
  });
});

describe("extractHomeworkSubjects", () => {
  it("extracts unique sorted subjects", () => {
    const items: LearningItem[] = [
      {
        id: "1",
        item_type: "homework",
        title: "H1",
        description: null,
        resource_type: null,
        subject: "Science",
        topic: null,
        external_url: null,
        instructions: null,
        due_at: null,
        created_at: "",
      },
      {
        id: "2",
        item_type: "homework",
        title: "H2",
        description: null,
        resource_type: null,
        subject: "Mathematics",
        topic: null,
        external_url: null,
        instructions: null,
        due_at: null,
        created_at: "",
      },
      {
        id: "3",
        item_type: "homework",
        title: "H3",
        description: null,
        resource_type: null,
        subject: "Science",
        topic: null,
        external_url: null,
        instructions: null,
        due_at: null,
        created_at: "",
      },
    ];

    expect(extractHomeworkSubjects(items)).toEqual(["Mathematics", "Science"]);
  });
});
