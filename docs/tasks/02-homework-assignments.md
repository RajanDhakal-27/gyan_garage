# Task 02: Homework Management & Viewer

## 1. Goal
Enable teachers to assign homework tasks with clear instructions and deadlines, and allow students to view pending assignments and track upcoming submission due dates.

## 2. User Flow
### Teacher Flow:
1. Teacher navigates to the **Homework** section in the Teacher Portal.
2. Teacher clicks **"Create Homework"** to open the assignment creation form.
3. Teacher inputs the assignment details:
   - **Title**: Assignment title (e.g., "Unit 4 Physics Problem Set").
   - **Subject**: Academic subject (e.g., "Science", "Mathematics", "English", "Social Studies", "Nepali").
   - **Instructions**: Detailed directions and required textbook questions for students to complete.
   - **Due Date & Time (`due_at`)**: Deadline for the assignment using a native datetime picker.
   - **Description**: Optional brief summary.
4. Teacher submits the form. The system stores the homework item and displays a confirmation toast.
5. The newly created homework appears in the active assignments list.
6. Teacher can edit any existing assignment (updating directions or deadline).
7. Teacher can delete an assignment with confirmation.

### Student Flow:
1. Student navigates to the **Homework** section in the Student Portal.
2. Student views a chronological list of assigned homework cards sorted by upcoming due date (`due_at`).
3. Each homework card displays:
   - Subject badge.
   - Homework title.
   - Due date and visual status badge (e.g., "Due in 2 days", "Due Today", "Overdue by 1d").
   - Created date and instruction snippet.
4. Student clicks **"Instructions"** or clicks on the card to open a full modal displaying detailed directions, assignment scope, and deadline details.
5. Student can filter homework by subject or status (All, Upcoming & Due Soon, Overdue), or search by title and instructions text.
6. If no homework is currently assigned, an empty state is displayed with a 1-click **"Load Sample Homework"** option.

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

---

## 4. Implementation Status: COMPLETE

- [x] **Database Types**: `src/types/database.ts` updated with `CreateHomeworkInput`.
- [x] **Pure Business Logic & Unit Tests**: `src/lib/homework.ts` and `src/lib/homework.test.ts` (14/14 Vitest tests passing; 24/24 total).
- [x] **Teacher Create & Edit Homework**: `src/components/homework/homework-form-dialog.tsx` with validation, subject chips, datetime picker, and toast notifications.
- [x] **Teacher Delete Homework**: Delete action with confirmation and immediate UI update.
- [x] **Student Filtering & Due Date Badging**: `getDueStatus` categorization (Overdue, Due Today, Due Soon, Upcoming) and filters in `src/components/homework/homework-manager.tsx`.
- [x] **Homework Detail Modal**: `src/components/homework/homework-detail-dialog.tsx` for complete instructions.
- [x] **Page Route**: `src/app/homework/page.tsx` wired with metadata and server-rendered shell.
- [x] **Sample Demo Seeder**: `src/lib/sample-homework.ts` with 4 realistic CDC Nepali curriculum homework assignments.
- [x] **Navigation**: `src/components/layout/navbar.tsx` updated with live link to `/homework`.
