import { QuizQuestion, SubmittedAnswer } from "@/types/database";

export interface QuestionBreakdown {
  question_id: string;
  question: string;
  options: string[];
  selected_answer: string | null;
  correct_answer: string;
  is_correct: boolean;
  marks_awarded: number;
  marks_possible: number;
}

export interface QuizScoreResult {
  score: number;
  total_marks: number;
  percentage: number;
  correct_count: number;
  total_questions: number;
  grade: string;
  gradeBadgeClass: string;
  breakdown: QuestionBreakdown[];
}

export function formatTimer(secondsRemaining: number): string {
  const safeSeconds = Math.max(0, Math.floor(secondsRemaining));
  const mins = Math.floor(safeSeconds / 60);
  const secs = safeSeconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function getCDCGrade(percentage: number): {
  grade: string;
  gradeBadgeClass: string;
} {
  if (percentage >= 90) {
    return {
      grade: "A+ (Outstanding)",
      gradeBadgeClass:
        "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300",
    };
  }
  if (percentage >= 80) {
    return {
      grade: "A (Excellent)",
      gradeBadgeClass:
        "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200",
    };
  }
  if (percentage >= 70) {
    return {
      grade: "B+ (Very Good)",
      gradeBadgeClass:
        "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200",
    };
  }
  if (percentage >= 60) {
    return {
      grade: "B (Good)",
      gradeBadgeClass:
        "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200",
    };
  }
  if (percentage >= 50) {
    return {
      grade: "C+ (Satisfactory)",
      gradeBadgeClass:
        "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200",
    };
  }
  if (percentage >= 35) {
    return {
      grade: "C (Acceptable)",
      gradeBadgeClass:
        "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200",
    };
  }
  return {
    grade: "Non-Graded (NG)",
    gradeBadgeClass:
      "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border-red-200",
  };
}

export function scoreQuizAttempt(
  questions: QuizQuestion[],
  answers: SubmittedAnswer[]
): QuizScoreResult {
  const answerMap = new Map<string, string>();
  answers.forEach((ans) => {
    if (ans.question_id) {
      answerMap.set(ans.question_id, ans.selected_answer);
    }
  });

  let earnedScore = 0;
  let totalMarks = 0;
  let correctCount = 0;

  const breakdown: QuestionBreakdown[] = questions.map((q, idx) => {
    const qId = q.id || `q_${idx + 1}`;
    const selected = answerMap.get(qId) || null;
    const possibleMarks = Number(q.marks) || 1;
    totalMarks += possibleMarks;

    const isCorrect = Boolean(selected && selected === q.correct_answer);
    const marksAwarded = isCorrect ? possibleMarks : 0;

    if (isCorrect) {
      earnedScore += possibleMarks;
      correctCount += 1;
    }

    return {
      question_id: qId,
      question: q.question,
      options: q.options || [],
      selected_answer: selected,
      correct_answer: q.correct_answer,
      is_correct: isCorrect,
      marks_awarded: marksAwarded,
      marks_possible: possibleMarks,
    };
  });

  const percentage =
    totalMarks > 0 ? Math.round((earnedScore / totalMarks) * 100 * 10) / 10 : 0;
  const gradeInfo = getCDCGrade(percentage);

  return {
    score: earnedScore,
    total_marks: totalMarks,
    percentage,
    correct_count: correctCount,
    total_questions: questions.length,
    grade: gradeInfo.grade,
    gradeBadgeClass: gradeInfo.gradeBadgeClass,
    breakdown,
  };
}
