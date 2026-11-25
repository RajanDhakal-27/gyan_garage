import { describe, it, expect } from "vitest";
import {
  formatQuizDuration,
  calculateTotalMarks,
  validateQuizInput,
  filterQuizzes,
  extractQuizSubjects,
} from "./quiz";
import { Quiz, QuizQuestion } from "@/types/database";

describe("formatQuizDuration", () => {
  it("formats minutes cleanly", () => {
    expect(formatQuizDuration(600)).toBe("10 mins");
    expect(formatQuizDuration(60)).toBe("1 min");
    expect(formatQuizDuration(3600)).toBe("1 hr");
  });

  it("formats mixed minutes and seconds", () => {
    expect(formatQuizDuration(90)).toBe("1m 30s");
  });

  it("handles zero or negative", () => {
    expect(formatQuizDuration(0)).toBe("0 mins");
  });
});

describe("calculateTotalMarks", () => {
  it("sums marks of questions", () => {
    const questions: QuizQuestion[] = [
      { id: "1", question: "Q1", options: ["A", "B"], correct_answer: "A", marks: 2 },
      { id: "2", question: "Q2", options: ["A", "B"], correct_answer: "B", marks: 3 },
    ];
    expect(calculateTotalMarks(questions)).toBe(5);
  });
});

describe("validateQuizInput", () => {
  it("rejects empty title", () => {
    const res = validateQuizInput({
      title: "",
      duration_seconds: 600,
      questions: [],
    });
    expect(res.isValid).toBe(false);
    expect(res.errors.title).toBeDefined();
  });

  it("rejects zero or negative duration", () => {
    const res = validateQuizInput({
      title: "Valid Title",
      duration_seconds: 0,
      questions: [],
    });
    expect(res.isValid).toBe(false);
    expect(res.errors.duration_seconds).toBeDefined();
  });

  it("rejects quiz without questions", () => {
    const res = validateQuizInput({
      title: "Valid Title",
      duration_seconds: 600,
      questions: [],
    });
    expect(res.isValid).toBe(false);
    expect(res.errors.questions).toBeDefined();
  });

  it("rejects question with missing correct answer", () => {
    const res = validateQuizInput({
      title: "Valid Title",
      duration_seconds: 600,
      questions: [
        {
          id: "1",
          question: "What is the capital?",
          options: ["Kathmandu", "Pokhara"],
          correct_answer: "Biratnagar", // Not in options
          marks: 1,
        },
      ],
    });
    expect(res.isValid).toBe(false);
    expect(res.errors.question_0_correct).toBeDefined();
  });

  it("accepts valid quiz structure", () => {
    const res = validateQuizInput({
      title: "Grade 10 Science: Force & Motion",
      subject: "Science",
      duration_seconds: 600,
      questions: [
        {
          id: "q1",
          question: "What is the SI unit of force?",
          options: ["Joule", "Newton", "Pascal", "Watt"],
          correct_answer: "Newton",
          marks: 1,
        },
      ],
    });
    expect(res.isValid).toBe(true);
    expect(Object.keys(res.errors).length).toBe(0);
  });
});

describe("filterQuizzes & extractQuizSubjects", () => {
  const sampleQuizzes: Quiz[] = [
    {
      id: "1",
      title: "Grade 10 Science Force",
      description: "Force chapter MCQ",
      subject: "Science",
      duration_seconds: 600,
      questions: [],
      created_at: "",
    },
    {
      id: "2",
      title: "Opt Math Trigonometry",
      description: "Trig identities",
      subject: "Mathematics",
      duration_seconds: 900,
      questions: [],
      created_at: "",
    },
  ];

  it("filters by subject", () => {
    const filtered = filterQuizzes(sampleQuizzes, { subject: "Mathematics" });
    expect(filtered).toHaveLength(1);
    expect(filtered[0].title).toBe("Opt Math Trigonometry");
  });

  it("searches by query", () => {
    const filtered = filterQuizzes(sampleQuizzes, { searchQuery: "identities" });
    expect(filtered).toHaveLength(1);
    expect(filtered[0].title).toBe("Opt Math Trigonometry");
  });

  it("extracts unique subjects", () => {
    expect(extractQuizSubjects(sampleQuizzes)).toEqual(["Mathematics", "Science"]);
  });
});
