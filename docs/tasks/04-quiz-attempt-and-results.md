# Task 04: Timed Quiz Attempt & Results

## 1. Goal
Provide students with an interactive, timed quiz examination interface that automatically scores responses upon submission or time expiry and provides an immediate results breakdown.

## 2. User Flow
### Student Flow:
1. Student selects a quiz from the quiz catalog and clicks **"Start Quiz"**.
2. A pre-quiz dialog / screen displays quiz parameters: title, total questions, time limit, and scoring information. Student clicks **"Begin Test Now"**.
3. The quiz interface loads in an active attempt view:
   - A sticky header shows the quiz title and an active countdown timer calculated from `duration_seconds`.
   - The countdown timer features visual urgency indicators (normal blue, amber under 60s, red pulsing under 30s).
   - A question navigation bar displays clickable question pills (1, 2, 3...) showing which questions have been answered and which remain pending.
4. Student reads each question prompt and selects an answer option from the multiple-choice choices.
5. If the countdown timer expires (`00:00`), the quiz locks answer inputs and automatically submits the attempt.
6. Alternatively, student clicks **"Submit Quiz"** and confirms submission via a confirmation dialog (which alerts if any questions are unanswered).
7. The system evaluates the submitted answers against the quiz's `questions` JSON data:
   - Calculates the score (sum of earned marks for correct answers).
   - Calculates total possible marks and percentage.
   - Evaluates Nepal CDC Letter Grade (A+, A, B+, B, C+, C, Non-Graded).
8. The attempt record is persisted in `quiz_attempts` with `quiz_id`, `answers`, `score`, `total_marks`, and `submitted_at`.
9. The student is immediately presented with the **Results Summary**:
   - Total score and percentage badge (e.g., "Score: 8/10 (80%)").
   - CDC Grade badge.
   - Time elapsed / taken.
   - Question review breakdown indicating student choice, correct answer, and correctness indicator with color-coded option badges.
10. Student can click **"Back to All Quizzes"** or **"Retake Quiz"**.

## 3. Database Tables and Columns Used
Referenced from `supabase/schema.sql`:

- **Table: `quizzes`** (Read-only reference)
  - `id` (`uuid`, primary key)
  - `title` (`text`)
  - `duration_seconds` (`integer`)
  - `questions` (`jsonb`, array of questions with answer keys)

- **Table: `quiz_attempts`**
  - `id` (`uuid`, primary key, default `gen_random_uuid()`)
  - `quiz_id` (`uuid`, foreign key referencing `quizzes.id` on delete cascade)
  - `answers` (`jsonb`, array of student submissions: `[{ "question_id": string, "selected_answer": string }]`)
  - `score` (`numeric(6,2)`, calculated earned points, check `score >= 0`)
  - `total_marks` (`numeric(6,2)`, maximum possible points, check `total_marks is null or total_marks >= 0`)
  - `submitted_at` (`timestamptz`, completion timestamp)
  - `created_at` (`timestamptz`, default `now()`)

---

## 4. Implementation Status: COMPLETE

- [x] **Database Types**: `src/types/database.ts` updated with `SubmittedAnswer` and `QuizAttempt`.
- [x] **Pure Business Logic & Unit Tests**: `src/lib/quiz-attempt.ts` and `src/lib/quiz-attempt.test.ts` (8/8 Vitest tests passing; 44/44 total).
- [x] **Auto-Grading & CDC Letter Grades**: Evaluation logic computes marks, percentage, and CDC grades (A+, A, B+, B, C+, C, NG).
- [x] **Active Countdown Timer**: Real-time timer with amber/red urgency styling and automatic submission on time expiry.
- [x] **Interactive Test Runner**: `src/components/quiz/quiz-attempt-runner.tsx` supporting question navigation, option selection, confirmation dialogs, and progress tracking.
- [x] **Results Summary & Answer Review**: Performance scorecard with time elapsed, percentage, and detailed question-by-question review (student choice vs correct answer).
- [x] **Persistence**: Attempts saved into `quiz_attempts` in Supabase.
- [x] **Page Route**: `src/app/quizzes/[id]/page.tsx` for direct quiz execution with loading and error states.
- [x] **Navigation**: `src/components/quiz/quiz-card.tsx` wired directly to `/quizzes/${quiz.id}`.
