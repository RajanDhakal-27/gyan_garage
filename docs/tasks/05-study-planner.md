# Task 05: Student Study Planner

## 1. Goal
Allow students to organize their study schedule by creating, updating, and completing personal study tasks and target deadlines with visible progress tracking.

## 2. User Flow
### Student Flow:
1. Student navigates to the **Study Planner** section in the Student Portal.
2. Student views their study planner dashboard:
   - Progress bar and summary metrics (e.g., "3 of 5 targets accomplished • 60%").
   - Filter controls: "All (5)", "Pending (2)", "Completed (3)".
3. Student adds a new study task or target using either:
   - The inline quick-add input bar: types the title and hits Enter/Add.
   - The detailed dialog: enters title, selects template suggestions, schedules a target date (`target_date`), and adds notes.
4. Student toggles a task's completion checkbox:
   - Instant optimistic UI update strikes through the title and updates the overall progress metric with a confirmation toast.
   - Toggling back reopens the task as pending.
5. Student can edit or delete a task with a confirmation prompt.
6. If no tasks exist, a welcoming empty state prompts the student with a 1-click **"Load Sample Targets"** option.

## 3. Database Tables and Columns Used
Referenced from `supabase/schema.sql`:

- **Table: `study_tasks`**
  - `id` (`uuid`, primary key, default `gen_random_uuid()`)
  - `title` (`text`, required task description or study target)
  - `description` (`text`, optional notes or target details)
  - `target_date` (`date`, target completion date)
  - `is_completed` (`boolean`, completion status flag, default `false`)
  - `created_at` (`timestamptz`, default `now()`)

---

## 4. Implementation Status: COMPLETE

- [x] **Database Types**: `src/types/database.ts` updated with `StudyTask` and `CreateStudyTaskInput`.
- [x] **Pure Business Logic & Unit Tests**: `src/lib/study-planner.ts` and `src/lib/study-planner.test.ts` (13/13 Vitest tests passing; 57/57 total).
- [x] **Completion Progress Metrics**: Computes total, completed, pending, and percentage metrics with real-time visual progress bar.
- [x] **Relative Target Date Badges**: Categorizes deadlines (Today, Tomorrow, Overdue, and formatted dates).
- [x] **Interactive Task Card**: `src/components/planner/task-card.tsx` with completion checkbox toggle, strikethrough styling, edit, and delete actions.
- [x] **Quick Inline Add & Dialog Modal**: `src/components/planner/task-form-dialog.tsx` with preset syllabus suggestions and date picker.
- [x] **Sample Demo Seeder**: `src/lib/sample-study-tasks.ts` with 5 realistic Nepali curriculum study targets.
- [x] **Page Route**: `src/app/planner/page.tsx` wrapped in `<Suspense>`.
- [x] **Navigation**: `src/components/layout/navbar.tsx` updated with live link to `/planner`.
