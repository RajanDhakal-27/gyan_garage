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
        "bg-[#10B981]/15 text-[#047857] border-[#10B981]/40",
    };
  }
  if (percentage >= 80) {
    return {
      grade: "A (Excellent)",
      gradeBadgeClass:
        "bg-[#10B981]/10 text-[#047857] border-[#10B981]/25",
    };
  }
  if (percentage >= 70) {
    return {
      grade: "B+ (Very Good)",
      gradeBadgeClass:
        "bg-[#0EA5E9]/10 text-[#0284C7] border-[#0EA5E9]/25",
    };
  }
  if (percentage >= 60) {
    return {
      grade: "B (Good)",
      gradeBadgeClass:
        "bg-[#0EA5E9]/10 text-[#0284C7] border-[#0EA5E9]/20",
    };
  }
  if (percentage >= 50) {
    return {
      grade: "C+ (Satisfactory)",
      gradeBadgeClass:
        "bg-[#F59E0B]/10 text-[#B45309] border-[#F59E0B]/25",
    };
  }
  if (percentage >= 35) {
    return {
      grade: "C (Acceptable)",
      gradeBadgeClass:
        "bg-[#F59E0B]/10 text-[#B45309] border-[#F59E0B]/20",
    };
  }
  return {
    grade: "Non-Graded (NG)",
    gradeBadgeClass:
      "bg-[#DB2777]/10 text-[#DB2777] border-[#DB2777]/25",
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
