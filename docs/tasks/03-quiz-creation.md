# Task 03: Quiz Creation & Catalog

## 1. Goal
Empower teachers to construct multiple-choice objective quizzes with configurable time limits and question sets, and provide a browsable quiz catalog for students.

## 2. User Flow
### Teacher Flow:
1. Teacher navigates to the **Quizzes** section in the Teacher Portal and clicks **"Create Quiz"**.
2. Teacher enters quiz metadata:
   - **Title**: Quiz title (e.g., "Grade 10 Science: Force & Motion").
   - **Subject**: Academic subject (e.g., "Science").
   - **Description**: Optional instructions or scope.
   - **Duration**: Time limit in minutes (stored in seconds as `duration_seconds`).
3. Teacher dynamically adds multiple-choice questions:
   - Question prompt text.
   - Multiple answer options (e.g., Option A, B, C, D).
   - Indication of the correct answer index / option.
   - Allocated marks per question.
4. Teacher can add, reorder, or delete questions within the form.
5. Teacher submits the quiz. The system validates that questions exist and `duration_seconds > 0`, saves to the database, and displays a success toast.
6. The quiz immediately appears in the quiz catalog with options to view details or delete.

### Student Flow:
1. Student opens the **Quizzes** view in the Student Portal.
2. Student views a catalog of available quizzes showing:
   - Title and subject badge.
   - Duration badge (e.g., "15 mins").
   - Total number of questions.
   - Description summary.
3. Student can filter quizzes by subject or search by title.
4. Student sees an action button on each card: "Start Quiz" (which transitions to the attempt flow).
5. If no quizzes are published, an empty state is displayed.

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
