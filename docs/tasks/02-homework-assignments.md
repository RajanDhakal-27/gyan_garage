# Task 02: Homework Management & Viewer

## 1. Goal
Enable teachers to assign homework tasks with clear instructions and deadlines, and allow students to view pending assignments and track upcoming submission due dates.

## 2. User Flow
### Teacher Flow:
1. Teacher navigates to the **Homework** section in the Teacher Portal.
2. Teacher clicks **"Create Homework"** to open the assignment creation form.
3. Teacher inputs the assignment details:
   - **Title**: Assignment title (e.g., "Unit 4 Physics Problem Set").
   - **Subject**: Academic subject (e.g., "Science", "Mathematics").
   - **Instructions**: Detailed directions and required questions for students to complete.
   - **Due Date & Time (`due_at`)**: Deadline for the assignment.
   - **Description**: Optional brief summary.
4. Teacher submits the form. The system stores the homework item and displays a confirmation toast.
5. The newly created homework appears in the teacher's active assignments list with option to delete.

### Student Flow:
1. Student navigates to the **Homework** section in the Student Portal.
2. Student views a chronological list of assigned homework cards sorted by upcoming due date (`due_at`).
3. Each homework card displays:
   - Subject badge.
   - Homework title.
   - Due date and visual status badge (e.g., "Due in 2 days", "Due Today", "Overdue").
   - Created date.
4. Student clicks on a homework card to expand and read full instructions.
5. If no homework is currently assigned, an empty state is displayed.

## 3. Database Tables and Columns Used
Referenced from `supabase/schema.sql`:

- **Table: `learning_items`**
  - `id` (`uuid`, primary key, default `gen_random_uuid()`)
  - `item_type` (`text`, check constraint `'resource' | 'homework'`; set to `'homework'`)
  - `title` (`text`, required assignment title)
  - `description` (`text`, optional summary)
  - `subject` (`text`, subject categorization)
  - `instructions` (`text`, detailed assignment instructions)
  - `due_at` (`timestamptz`, deadline date and time)
  - `created_at` (`timestamptz`, default `now()`)
