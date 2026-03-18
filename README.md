# Task Board Assessment Solution

A polished Kanban-style task board built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## What this project includes

- Anonymous guest sign-in with Supabase Auth
- Row Level Security so each guest only sees their own tasks
- Four default board columns: To Do, In Progress, In Review, Done
- Create task flow with title, description, priority, and due date
- Drag and drop between columns to update status
- Loading, empty, and error states
- Bonus features: search, priority filtering, due date indicators, and board summary stats

## Tech stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Supabase
- @hello-pangea/dnd

## Local setup

1. Create a new Supabase project.
2. In Supabase Auth, enable Anonymous sign-ins.
3. Run the SQL in `supabase/schema.sql` inside the SQL editor.
4. Copy `.env.example` to `.env.local` and add your Supabase values.
5. Install dependencies:

   ```bash
   npm install
   ```

6. Start the dev server:

   ```bash
   npm run dev
   ```

7. Open `http://localhost:3000`.

## Deploy to Vercel

1. Push this project to GitHub.
2. Import the GitHub repo into Vercel.
3. Add the same two environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy.
