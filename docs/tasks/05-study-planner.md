# Task 05: Student Study Planner

## 1. Goal
Allow students to organize their study schedule by creating, updating, and completing personal study tasks and target deadlines with visible progress tracking.

## 2. User Flow
### Student Flow:
1. Student navigates to the **Study Planner** section in the Student Portal.
2. Student views their study planner dashboard:
   - Progress bar and summary metrics (e.g., "3 of 5 tasks completed - 60%").
   - Filter controls: "All", "Pending", "Completed".
3. Student adds a new study task or target using the quick-add input:
   - **Title**: Required task or target name (e.g., "Solve 5 Trigonometry questions", "Read Chapter 3 Chemistry").
   - **Target Date**: Target completion deadline date (`target_date`).
   - **Description**: Optional notes or target details.
4. Student clicks **"Add Task"**; a toast confirms creation and the task immediately appends to the list.
5. Student toggles a task's completion checkbox:
   - Updating `is_completed` to `true` strikes through the title and updates the overall progress metric.
   - Toggling back resets status to pending.
6. Student can click a delete action to remove a task.
7. If no tasks exist, a welcoming empty state prompts the student to add their first study target.

## 3. Database Tables and Columns Used
Referenced from `supabase/schema.sql`:

- **Table: `study_tasks`**
  - `id` (`uuid`, primary key, default `gen_random_uuid()`)
  - `title` (`text`, required task description or study target)
  - `description` (`text`, optional notes or target details)
  - `target_date` (`date`, target completion date)
  - `is_completed` (`boolean`, completion status flag, default `false`)
  - `created_at` (`timestamptz`, default `now()`)
