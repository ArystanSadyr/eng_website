# BrightSteps English

A responsive English practice website for elementary and middle school learners. It includes a dashboard, searchable lesson library, vocabulary, multiple-choice and fill-in-the-blank style activities, reading, listening, video comprehension, answer explanations, score calculation, and progress tracking.

## Architecture

- **Frontend:** React 18 + Vite. Static build output goes to `dist/` and is hosted by Vercel Hobby. `vercel.json` routes page requests back to the single-page app.
- **Authentication and progress:** Supabase Auth and Postgres via `@supabase/supabase-js`. Only the Supabase project URL and public anon/publishable key are used in the browser. Row Level Security limits profiles and learning records to their owner.
- **Lesson content:** The six starter lessons are bundled in `src/main.jsx`, so practice works without a Supabase project. The SQL migration includes public content tables for future content management; the current app does not read lesson content from those tables.
- **Media:** Listening uses the browser's built-in English speech synthesis. The video activity links to the public MDN sample flower video and offers a text fallback if the host is unavailable. No student media is uploaded.

## Run locally

Requirements: Node.js 20 or newer and npm.

```sh
npm install
cp .env.example .env.local
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`). The app works in guest mode without environment variables; authentication and cloud progress require the Supabase setup below.

```sh
npm run lint
npm run build
npm run preview
```

## Supabase setup

1. Create a Supabase project on the Free plan. Do not add a payment method or upgrade.
2. In **Project Settings → API**, copy the Project URL and the public anon/publishable key. Never use a `service_role` key in this app.
3. In **SQL Editor**, run [`supabase/migrations/202610180001_initial_schema.sql`](supabase/migrations/202610180001_initial_schema.sql).
4. In **Authentication → Providers → Email**, leave email/password enabled. Set the email confirmation behavior you want. For a school/child audience, have a parent or teacher supervise registration and choose an appropriate confirmation process.
5. In **Authentication → URL Configuration**, set Site URL to your deployed `https://<your-project>.vercel.app`. Add Redirect URLs `http://localhost:5173/**` and `https://<your-project>.vercel.app/**`. If using Vercel preview deployments, add a narrowly scoped pattern for your account, for example `https://*-<your-vercel-account>.vercel.app/**`.
6. In **Authentication → Email Templates**, ensure the confirmation link uses the redirect destination so it returns to the app.
7. For local Supabase mode, set `.env.local` from `.env.example`. Keep `.env.local` private; it is ignored by Git.

The schema creates `profiles`, `lessons`, `exercises`, `quiz_attempts`, and `student_progress`. RLS is enabled on every table. Students can read/update their own profile and progress, insert/read their own quiz attempts, and read only published lesson content. There are no client policies for lesson/exercise writes or deletes and no student role column. Admin/content changes must be made through the Supabase dashboard or a trusted server-side tool, never by exposing a service-role key in the frontend.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | For accounts | Supabase Project URL |
| `VITE_SUPABASE_ANON_KEY` | For accounts | Supabase public anon/publishable key; safe for browser use only with RLS enabled |
| `VITE_SITE_URL` | Recommended | Current app URL used for email confirmation redirects; local example is `http://localhost:5173` |

Vite embeds `VITE_*` values in public browser code. Never place a service-role key, database password, or other secret in any `VITE_*` variable.

## GitHub and Vercel deployment

1. Create a **private or public** GitHub repository under your account. Do not add a license or README if GitHub asks, because these files are already included.
2. From this directory, run:

   ```sh
   git init
   git add .
   git commit -m "Build BrightSteps English learning site"
   git branch -M main
   git remote add origin https://github.com/<your-account>/<your-repository>.git
   git push -u origin main
   ```

3. In Vercel, choose **Add New → Project**, import that GitHub repository, and accept the Vite defaults. Framework: Vite; Build Command: `npm run build`; Output Directory: `dist`; Install Command: `npm install`.
4. Add the three variables from `.env.example` in **Project → Settings → Environment Variables**. Use the real Supabase URL/key and the eventual Vercel production URL for `VITE_SITE_URL`. Apply at least to Production and Preview as appropriate, then redeploy.
5. Add the final `*.vercel.app` address to Supabase URL Configuration as described above. Test confirmation emails and sign-in from the deployed URL.
6. Future pushes to the connected branch trigger a Vercel deployment. Pull requests/other branches can get preview deployments.

The public URL will be `https://<project-name>.vercel.app`. No GitHub repository or Vercel deployment has been created by this project setup.

## Free plan notes (checked 18 October 2026)

- Vercel Hobby is free for personal, non-commercial use and includes Git deployments, HTTPS, preview deployments, and 100 GB Fast Data Transfer per month. Hobby usage limits apply; overages may require waiting for the quota window to reset. Vercel currently describes Hobby as for personal projects, so confirm its terms fit your school/competition use before publishing.
- Supabase Free currently allows two free projects per organization, 500 MB database per project, 1 GB file storage, 5 GB egress, and 50,000 monthly active users. Free projects may pause after one week of inactivity; free database projects enter read-only mode above the 500 MB database quota. Keep media external or small and export/backup important progress.
- Free plan limits and terms change. Check the provider dashboards before inviting a class; there is no promise of unlimited availability or backups on free tiers.

## Child privacy

This demo asks only for email and a display name/nickname when an account is created. It has no analytics or advertising. For real use by children, obtain the school/parent's approval, use teacher/parent-controlled accounts and email addresses where appropriate, publish a privacy notice, set a data retention/deletion process, and check applicable child privacy, consent, and school rules for your location. A demo deployment is not automatically compliant with any privacy law. Supabase authentication itself still requires an email address; guest mode can be used without registration.

## Scope and known limitations

- Starter lesson definitions are static in the frontend. The migration provides a secure schema for a later content-management feature, but no admin UI exists.
- Guest progress is stored only in that browser's local storage. Signed-in progress syncs to Supabase; signing out does not clear the browser's guest/local cache.
- The video activity depends on the external MDN sample URL. If unavailable, the comprehension prompt remains usable with its built-in fallback. Speech synthesis depends on browser and device voices.
- Password reset, teacher accounts, progress export, and admin tools are not implemented.
- Quiz scores are client-submitted learning records, not tamper-proof assessments. Do not use for grades or high-stakes decisions.
