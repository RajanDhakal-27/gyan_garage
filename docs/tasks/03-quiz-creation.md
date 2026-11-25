# Task 03: Quiz Creation & Catalog

## 1. Goal
Empower teachers to construct multiple-choice objective quizzes with configurable time limits and question sets, and provide a browsable quiz catalog for students.

## 2. User Flow
### Teacher Flow:
1. Teacher navigates to the **Quizzes** section in the Teacher Portal and clicks **"Create Quiz"**.
2. Teacher enters quiz metadata:
   - **Title**: Quiz title (e.g., "Grade 10 Science: Force & Gravitation").
   - **Subject**: Academic subject (e.g., "Science", "Mathematics", "English", "Social Studies", "Nepali").
   - **Description**: Optional syllabus coverage or instructions.
   - **Duration**: Time limit in minutes (validated and stored in seconds as `duration_seconds`).
3. Teacher dynamically adds multiple-choice questions:
   - Question prompt text.
   - Multiple answer options (Option A, B, C, D) with add/delete options.
   - Indication of the correct answer via radio selector.
   - Allocated marks per question.
4. Teacher can add, edit, or delete questions within the form.
5. Teacher submits the quiz. The system validates that questions exist, options are valid, and `duration_seconds > 0`, saves to the Supabase `quizzes` table, and displays a success toast.
6. The quiz immediately appears in the quiz catalog with options to edit or delete.

### Student Flow:
1. Student opens the **Quizzes** view in the Student Portal.
2. Student views a catalog of available quizzes showing:
   - Title and subject badge.
   - Duration badge (e.g., "10 mins").
   - Question count badge (e.g., "4 Qs") and Total Marks badge.
   - Syllabus description summary.
3. Student can filter quizzes by subject or search by title.
4. Student can click **"Preview Qs"** to inspect question scope in a detail modal.
5. Student can click **"Start Quiz"** to begin the quiz workflow (wired to Task 04 interactive attempt).
6. If no quizzes are published, an empty state is displayed with a 1-click **"Load Sample Quizzes"** option.

## 3. Database Tables and Columns Used
Referenced from `supabase/schema.sql`:

- **Table: `quizzes`**
  - `id` (`uuid`, primary key, default `gen_random_uuid()`)
  - `title` (`text`, required quiz title)
  - `description` (`text`, optional overview)
  - `subject` (`text`, subject categorization)
  - `duration_seconds` (`integer`, check `duration_seconds > 0`, default `600`)
  - `questions` (`jsonb`, check `jsonb_typeof(questions) = 'array'`, contains array of question objects: `[{ "id": string, "question": string, "options": string[], "correct_answer": string, "marks": number }]`)
  - `created_at` (`timestamptz`, default `now()`)

---

## 4. Implementation Status: COMPLETE

- [x] **Database Types**: `src/types/database.ts` updated with `QuizQuestion`, `Quiz`, and `CreateQuizInput`.
- [x] **Pure Business Logic & Unit Tests**: `src/lib/quiz.ts` and `src/lib/quiz.test.ts` (12/12 Vitest tests passing; 36/36 total).
- [x] **Interactive Question Builder & Form Dialog**: `src/components/quiz/quiz-form-dialog.tsx` supporting dynamic question and option creation, correct answer radio selection, marks adjustment, and validation with Sonner feedback.
- [x] **Teacher Edit & Delete Quiz**: Modals and actions to update or remove quizzes with confirmation.
- [x] **Student Quiz Catalog & Filtering**: Search and subject filter in `src/components/quiz/quiz-manager.tsx`.
- [x] **Quiz Preview Modal**: `src/components/quiz/quiz-detail-dialog.tsx` displaying full questions and options breakdown.
- [x] **Page Route**: `src/app/quizzes/page.tsx` wrapped in `<Suspense>`.
- [x] **Sample Demo Seeder**: `src/lib/sample-quizzes.ts` with 3 comprehensive Nepali curriculum quizzes (SEE Science Gravitation, Opt Math Trigonometry, and English Grammar).
- [x] **Navigation**: `src/components/layout/navbar.tsx` updated with direct link to `/quizzes`.
