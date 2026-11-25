# Task 01: Learning Resources Library

## 1. Goal
Allow teachers to publish educational resources (notes, question papers, video lessons, and online meeting links) and enable students to browse, filter by subject or topic, and open external materials.

## 2. User Flow
### Teacher Flow:
1. Teacher accesses the Teacher Portal navigation and opens the Learning Resources management view.
2. Teacher clicks **"Add Resource"** to open the resource entry dialog/form.
3. Teacher fills in resource details:
   - **Title**: Resource title (e.g., "Class 10 Opt Math Notes - Trigonometry").
   - **Resource Type**: Category selector (`'Notes'`, `'Question Paper'`, `'Video Lesson'`, `'Meeting Link'`, `'Reference Material'`).
   - **Subject**: Academic subject (e.g., "Mathematics", "Science", "English", "Social Studies", "Nepali").
   - **Topic**: Specific curriculum topic (e.g., "Trigonometry", "Optics").
   - **External URL**: Link to external content (e.g., YouTube video, Google Drive PDF, Zoom/Google Meet link).
   - **Description**: Optional description or summary notes.
4. Teacher submits the form. The system saves the item and displays a success toast.
5. The new resource immediately renders in the resource list.
6. Teacher can edit any existing resource (updating title, subject, link, or description).
7. Teacher can remove any published resource with a confirmation prompt.

### Student Flow:
1. Student navigates to the **Resources** tab in the Student Portal.
2. Student views a grid of resource cards displaying title, subject badge, topic, resource type icon, and description.
3. Student filters resources by subject and/or topic, or searches by title.
4. Student clicks on a card or **"Details"** to inspect the full summary and notes.
5. Student clicks **"Open"** / action link to launch external resources (YouTube, Google Drive, Zoom meeting) in a new tab safely.
6. If no resources match the filter or if none have been added, a user-friendly empty state is displayed with a 1-click **"Load Sample Resources"** option.

## 3. Database Tables and Columns Used
Referenced from `supabase/schema.sql`:

- **Table: `learning_items`**
  - `id` (`uuid`, primary key, default `gen_random_uuid()`)
  - `item_type` (`text`, check constraint `'resource' | 'homework'`; set to `'resource'`)
  - `title` (`text`, required resource title)
  - `description` (`text`, optional context or summary)
  - `resource_type` (`text`, e.g., `'Notes'`, `'Question Paper'`, `'Video Lesson'`, `'Meeting Link'`)
  - `subject` (`text`, subject categorization)
  - `topic` (`text`, topic categorization)
  - `external_url` (`text`, external link to document, video, or meeting)
  - `created_at` (`timestamptz`, default `now()`)

---

## 4. Implementation Status: COMPLETE

- [x] **Database Types**: `src/types/database.ts` matches `supabase/schema.sql`.
- [x] **Supabase Client**: `src/lib/supabase.ts` with connection verification.
- [x] **Business Logic & Unit Tests**: `src/lib/resources.ts` and `src/lib/resources.test.ts` (10/10 Vitest tests passing).
- [x] **Role Switcher Navigation**: `src/context/role-context.tsx` and `src/components/layout/navbar.tsx` providing single-user demo role toggle (Student/Teacher) with no auth required.
- [x] **Teacher Create & Edit Resource**: `src/components/resources/resource-form-dialog.tsx` with validation, subject shortcuts, and Sonner toast notifications.
- [x] **Teacher Delete Resource**: Delete action with confirmation and immediate UI update.
- [x] **Student Search & Filtering**: Multi-field search, subject filter, topic filter, and resource type filter in `src/components/resources/resource-manager.tsx`.
- [x] **Resource Detail View**: `src/components/resources/resource-detail-dialog.tsx` for viewing complete notes and launching links.
- [x] **Empty, Loading & Error States**: Skeleton cards during load, retry on error, and 1-click demo seeder (`src/lib/sample-resources.ts`).
