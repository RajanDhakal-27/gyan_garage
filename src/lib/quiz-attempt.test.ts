import { describe, it, expect } from "vitest";
import {
  formatTimer,
  getCDCGrade,
  scoreQuizAttempt,
} from "./quiz-attempt";
import { QuizQuestion, SubmittedAnswer } from "@/types/database";

describe("formatTimer", () => {
  it("formats standard minutes and seconds", () => {
    expect(formatTimer(600)).toBe("10:00");
    expect(formatTimer(599)).toBe("09:59");
    expect(formatTimer(65)).toBe("01:05");
    expect(formatTimer(5)).toBe("00:05");
  });

  it("handles 0 and negative seconds", () => {
    expect(formatTimer(0)).toBe("00:00");
    expect(formatTimer(-10)).toBe("00:00");
  });
});

describe("getCDCGrade", () => {
  it("assigns A+ for >= 90%", () => {
    expect(getCDCGrade(95).grade).toContain("A+");
    expect(getCDCGrade(90).grade).toContain("A+");
  });

  it("assigns A for 80-89%", () => {
    expect(getCDCGrade(85).grade).toContain("A");
  });

  it("assigns B+ for 70-79%", () => {
    expect(getCDCGrade(75).grade).toContain("B+");
  });

  it("assigns Non-Graded for < 35%", () => {
    expect(getCDCGrade(25).grade).toContain("Non-Graded");
  });
});

describe("scoreQuizAttempt", () => {
  const sampleQuestions: QuizQuestion[] = [
    {
      id: "q1",
      question: "SI unit of force?",
      options: ["Joule", "Newton", "Pascal"],
      correct_answer: "Newton",
      marks: 2,
    },
    {
      id: "q2",
      question: "Value of g on moon?",
      options: ["1/6th", "Equal", "Zero"],
      correct_answer: "1/6th",
      marks: 3,
    },
    {
      id: "q3",
      question: "Weightlessness in free fall?",
      options: ["Yes", "No"],
      correct_answer: "Yes",
      marks: 1,
    },
  ];

  it("calculates 100% score when all answers are correct", () => {
    const answers: SubmittedAnswer[] = [
      { question_id: "q1", selected_answer: "Newton" },
      { question_id: "q2", selected_answer: "1/6th" },
      { question_id: "q3", selected_answer: "Yes" },
    ];

    const result = scoreQuizAttempt(sampleQuestions, answers);
    expect(result.score).toBe(6);
    expect(result.total_marks).toBe(6);
    expect(result.percentage).toBe(100);
    expect(result.correct_count).toBe(3);
    expect(result.breakdown.every((b) => b.is_correct)).toBe(true);
  });

  it("calculates partial score when some answers are wrong or unattempted", () => {
    const answers: SubmittedAnswer[] = [
      { question_id: "q1", selected_answer: "Newton" }, // Correct (2 marks)
      { question_id: "q2", selected_answer: "Zero" },   // Wrong (0 marks)
      // q3 omitted (0 marks)
    ];

    const result = scoreQuizAttempt(sampleQuestions, answers);
    expect(result.score).toBe(2);
    expect(result.total_marks).toBe(6);
    expect(result.percentage).toBe(33.3);
    expect(result.correct_count).toBe(1);

    expect(result.breakdown[0].is_correct).toBe(true);
    expect(result.breakdown[1].is_correct).toBe(false);
    expect(result.breakdown[2].selected_answer).toBeNull();
    expect(result.breakdown[2].is_correct).toBe(false);
  });
});
