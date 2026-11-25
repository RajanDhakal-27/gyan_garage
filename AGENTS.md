## MVP Guardrails
- **No Auth:** Do not implement login, signup, or Supabase Auth. Treat the app as a single-user demo.
- **Database:** Always read `supabase/schema.sql` before writing any Supabase queries or TypeScript types. Never guess table or column names. If a feature needs a new column or table, update `supabase/schema.sql` first and tell the user to run the SQL in Supabase.
- **Stack:** Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, `@supabase/supabase-js`.
- **Testing:** Use Vitest (`npm test`). Do NOT install Playwright or Cypress. Write unit tests for pure business logic
- **Scope:** Keep solutions simple, clean, and demo-ready. Avoid over-engineering.

## UI Guidelines
- **Components:** Use shadcn/ui first (`npx shadcn@latest add <component>`). Don't hand-build buttons, inputs, dialogs, etc. Use `lucide-react` for icons.
- **Styling:** Tailwind utility classes only. No custom CSS or inline styles. Use theme tokens (`bg-background`, `text-muted-foreground`), not hardcoded colors, and `cn()` for conditional classes.
- **Layout:** Mobile-first and responsive. Keep spacing and typography consistent across pages.
- **States:** Every data-driven view must handle loading, empty, and error states. Use toasts (`sonner`) for action feedback.
- **Components architecture:** Server Components by default. Add `"use client"` only when you need state, effects, or event handlers.
- **Accessibility:** Semantic HTML, labels on all inputs, alt text on images.
