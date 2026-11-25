import { Quiz, QuizQuestion, CreateQuizInput } from "@/types/database";

export function formatQuizDuration(seconds: number): string {
  if (seconds <= 0) return "0 mins";
  const mins = Math.floor(seconds / 60);
  const remainingSecs = seconds % 60;

  if (mins === 0) return `${remainingSecs}s`;
  if (remainingSecs === 0) {
    if (mins >= 60 && mins % 60 === 0) {
      const hrs = mins / 60;
      return hrs === 1 ? "1 hr" : `${hrs} hrs`;
    }
    return `${mins} min${mins === 1 ? "" : "s"}`;
  }
  return `${mins}m ${remainingSecs}s`;
}

export function calculateTotalMarks(questions: QuizQuestion[]): number {
  return questions.reduce((sum, q) => sum + (Number(q.marks) || 1), 0);
}

export function validateQuizInput(input: CreateQuizInput): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!input.title || input.title.trim().length === 0) {
    errors.title = "Quiz title is required";
  } else if (input.title.trim().length < 3) {
    errors.title = "Title must be at least 3 characters";
  }

  if (
    typeof input.duration_seconds !== "number" ||
    isNaN(input.duration_seconds) ||
    input.duration_seconds <= 0
  ) {
    errors.duration_seconds = "Duration must be greater than 0 seconds";
  }

  if (!Array.isArray(input.questions) || input.questions.length === 0) {
    errors.questions = "At least one question is required for a quiz";
  } else {
    input.questions.forEach((q, idx) => {
      const qNum = idx + 1;
      if (!q.question || q.question.trim().length === 0) {
        errors[`question_${idx}`] = `Question ${qNum} prompt cannot be empty`;
      }
      if (!Array.isArray(q.options) || q.options.filter((o) => o && o.trim()).length < 2) {
        errors[`question_${idx}_options`] = `Question ${qNum} must have at least 2 options`;
      } else if (!q.correct_answer || !q.options.includes(q.correct_answer)) {
        errors[`question_${idx}_correct`] = `Question ${qNum} must have a marked correct option`;
      }
    });
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export interface QuizFilterOptions {
  searchQuery?: string;
  subject?: string;
}

export function filterQuizzes(
  quizzes: Quiz[],
  options: QuizFilterOptions = {}
): Quiz[] {
  const query = options.searchQuery?.trim().toLowerCase() || "";
  const selectedSubject = options.subject?.trim();

  return quizzes.filter((quiz) => {
    if (selectedSubject && selectedSubject !== "All" && quiz.subject !== selectedSubject) {
      return false;
    }

    if (query) {
      const titleMatch = quiz.title.toLowerCase().includes(query);
      const subjectMatch = (quiz.subject || "").toLowerCase().includes(query);
      const descMatch = (quiz.description || "").toLowerCase().includes(query);
      if (!titleMatch && !subjectMatch && !descMatch) {
        return false;
      }
    }

    return true;
  });
}

export function extractQuizSubjects(quizzes: Quiz[]): string[] {
  const subjects = new Set<string>();
  quizzes.forEach((quiz) => {
    if (quiz.subject && quiz.subject.trim()) {
      subjects.add(quiz.subject.trim());
    }
  });
  return Array.from(subjects).sort();
}
