# BrightSteps English

A responsive English practice website for elementary and middle school learners. It includes a dashboard, searchable lesson library, 26 short quizzes, vocabulary, grammar, multiple-choice, fill-in-the-blank and spelling activities, reading, listening, video comprehension, answer explanations, score calculation, and progress tracking. The ten new original Grade 3–4 practice sets use themes publicly listed for Top Stars for Kazakhstan. A language selector translates the interface and answer choices into Kazakh or Russian; all English learning tasks remain in English.

## Architecture

- **Frontend:** React 18 + Vite. Static build output goes to `dist/` and is hosted by Vercel Hobby. `vercel.json` routes page requests back to the single-page app.
- **Authentication and progress:** Supabase Auth and Postgres via `@supabase/supabase-js`. Only the Supabase project URL and public anon/publishable key are used in the browser. Row Level Security limits profiles and learning records to their owner.
- **Lesson content:** All 26 lessons are bundled in `src/main.jsx`, so practice works without a Supabase project. The ten Grade 3–4 sets are original practice inspired by the publisher's listed themes and are not copied workbook questions. The SQL migration includes public content tables for future content management; the current app does not read lesson content from those tables.
- **Media:** Listening uses the browser's English speech synthesis, preferring installed natural/online English voices when available. Learners can choose another installed English voice in a lesson; their choice is saved on that device. Voice availability and sound quality depend on the browser and operating system. The video activity links to the public MDN sample flower video and offers a text fallback if the host is unavailable. No student media is uploaded.

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

Follow the detailed [Supabase step-by-step guide](docs/SUPABASE_SETUP.md). In brief: create a Free project, run the included SQL migration, add the Project URL and publishable key to local/Vercel environment settings, and configure Auth redirects after Vercel gives you the production URL.

The schema creates `profiles`, `lessons`, `exercises`, `quiz_attempts`, and `student_progress`. RLS is enabled on every table. Students can read/update their own profile and progress, insert/read their own quiz attempts, and read only published lesson content. There are no client policies for lesson/exercise writes or deletes and no student role column. Admin/content changes must be made through the Supabase dashboard or a trusted server-side tool, never by exposing a service-role key in the frontend.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | For accounts | Supabase Project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | For accounts | Supabase public publishable key (`sb_publishable_…`); safe for browser use only with RLS enabled |
| `VITE_SITE_URL` | Recommended | Current app URL used for email confirmation redirects; local example is `http://localhost:5173` |

Vite embeds `VITE_*` values in public browser code. Never place a Supabase secret key (`sb_secret_…`), legacy `service_role` key, database password, or other secret in any `VITE_*` variable. For compatibility, the app also recognizes `VITE_SUPABASE_ANON_KEY` if you already set it, but new projects should use the publishable key.

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
