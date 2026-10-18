# Supabase setup: step by step

This guide connects BrightSteps English to a Supabase project for student accounts and cross-device progress. You can skip all Supabase steps if you only want guest lessons; the quizzes run without it.

## Before you start

- You need your own Supabase account and a Supabase project. This guide uses the Free plan; do not choose an upgrade or paid add-on.
- You need the BrightSteps project folder and a text editor.
- Never send anyone your Supabase database password, email password, `sb_secret_…` key, or legacy `service_role` key. The website only needs a publishable key.
- For children, have a parent or teacher supervise account setup and choose an appropriate email/consent process before real learners register.

## 1. Create a Supabase project

1. Open [supabase.com/dashboard](https://supabase.com/dashboard) and sign in or create an account.
2. Choose **New project**. If prompted, create/select an organization and keep its plan on **Free**.
3. Give the project a recognizable name, such as `brightsteps-english`.
4. Create a strong database password and store it in your own password manager. This password is for database administration; it is not the student's website password and it is not used by the browser app.
5. Select a region near the people who will use the site, then choose **Create new project**.
6. Wait until the project status is ready. The setup can take a few minutes.

## 2. Create the BrightSteps tables and security policies

1. Open the project in the Supabase dashboard.
2. In the left menu, select **SQL Editor** and choose **New query**.
3. In the project folder, open `supabase/migrations/202610180001_initial_schema.sql` in a text editor. Select and copy the entire file.
4. Paste it into the new SQL query in Supabase.
5. Select **Run**. Wait for the success message. If the editor reports an error, stop and read the line it identifies; don't partially edit the security policies to make the error disappear.
6. Open **Table Editor** and confirm these tables exist: `profiles`, `lessons`, `exercises`, `quiz_attempts`, and `student_progress`.
7. In **Authentication → Policies** (or the table's RLS/policies view), confirm Row Level Security is enabled for all five tables and the policies from the migration appear.

The current lesson text and questions are bundled in the website, so the `lessons` and `exercises` tables start empty. That is expected. Those tables are reserved for a future lesson-management feature. The app currently saves attempts and progress to `quiz_attempts` and `student_progress` for signed-in users.

The migration does not create a teacher role or give students lesson-editing access. Policies restrict profile and progress reads to the matching signed-in user. Students cannot grant themselves an administrator role because there is no role field or client write policy for roles/content.

## 3. Copy the project URL and public key

1. In the dashboard, open **Connect** or **Project Settings → API Keys** (the dashboard may label the keys page **API**).
2. Copy the **Project URL**. It looks like `https://abcdefghijk.supabase.co`.
3. Copy the **Publishable key**. New keys start with `sb_publishable_`. A legacy `anon` key can work too, but Supabase is moving to publishable/secret key names.
4. Keep the `sb_secret_…` or legacy `service_role` key private. Do not paste it into the website, a `VITE_*` variable, GitHub, or chat. Never use the database password as an API key.

## 4. Connect your local copy

1. In the project folder, make a copy of `.env.example` named `.env.local`.
2. Open `.env.local` in a text editor and replace the example values:

   ```dotenv
   VITE_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_PASTE_YOUR_PUBLIC_KEY_HERE
   VITE_SITE_URL=http://localhost:5173
   ```

3. Save the file. `.env.local` is excluded by `.gitignore`; keep it that way. The publishable key is intended to be used in the browser, but the database still relies on RLS for access control.
4. In PowerShell, from the project directory, run `npm install` once and then `npm run dev`.
5. Open the local URL Vite prints (normally `http://localhost:5173`). Use **Create account** to register a parent/teacher-controlled test account, confirm the email if Supabase asks, and sign in.
6. Complete a lesson. Visit **My progress**. It should show the completed lesson. In Supabase **Table Editor → student_progress**, you should see a row for the signed-in user's ID. The `profiles` table should also have the nickname created by the signup trigger.

Without these environment values, the app continues to work in guest mode. It saves guest progress in that browser only and displays setup instructions if you submit the account form.

## 5. Configure email sign-up

1. In the Supabase dashboard, open **Authentication → Sign In / Providers** (some dashboard versions call this **Providers**).
2. Select **Email** and make sure email/password sign-in is enabled.
3. Keep email confirmation enabled for a real deployment unless your parent/teacher has deliberately chosen a different supervised setup. Hosted projects normally require confirmation by default.
4. The built-in email sender is for trying the feature and has a low rate limit (currently two emails per hour) with best-effort delivery. Test with one account first. If a class needs reliable email delivery, configure an SMTP provider; check its current pricing and terms before using it, because it may not be free.
5. In **Authentication → Email Templates**, leave the confirmation link intact unless you have a reason to change it. This app passes the current site URL as its confirmation redirect.

## 6. Deploy, then set the production redirect URLs

Supabase needs to allow the exact website domain for confirmation links. First push the code to GitHub and deploy it through Vercel using the README's GitHub/Vercel instructions. Vercel will give you a URL such as `https://brightsteps-english.vercel.app`.

Then configure Supabase:

1. In Supabase, open **Authentication → URL Configuration**.
2. Set **Site URL** to the actual production URL Vercel assigned, e.g. `https://brightsteps-english.vercel.app`. Do not include a path such as `/login`.
3. In **Redirect URLs**, add `http://localhost:5173/**` for local development.
4. Add the exact production redirect `https://brightsteps-english.vercel.app/**` (replace it with your real Vercel host).
5. If you will test Vercel preview deployments, add a narrowly scoped wildcard using your Vercel account slug, for example `https://*-your-account.vercel.app/**`. Avoid allowing all domains with a broad wildcard.
6. Save the settings.

The Site URL is the default destination. An email redirect passed by the app must also match an allowed Redirect URL. If confirmation links go to localhost or show a redirect-not-allowed error, recheck these values and the host spelling.

## 7. Add the variables to Vercel

1. In the Vercel project, open **Settings → Environment Variables**.
2. Add `VITE_SUPABASE_URL` with the same Project URL from step 3.
3. Add `VITE_SUPABASE_PUBLISHABLE_KEY` with the public `sb_publishable_…` key.
4. Add `VITE_SITE_URL` with your production `https://<project>.vercel.app` URL.
5. Select the Production environment. Also select Preview if you want the same Supabase project used by preview deployments.
6. Save, then open **Deployments** and redeploy the latest deployment so Vite builds with the variables.
7. Open the Vercel URL, register a supervised test account, confirm its email, sign in, complete a quiz, refresh, and confirm progress remains visible.

Changing a Vercel variable does not update an already-built deployment until it is redeployed. Do not create a custom domain or upgrade plan just to complete this setup.

## 8. Verify student-data separation

The SQL migration enables RLS and gives each signed-in account access only to rows whose `user_id`/`id` matches its own auth ID. For a careful manual check, create two test accounts controlled by an adult, complete a lesson under each, and verify each account only sees its own progress when signed into the site. Do not use real children's accounts for a security test.

The quiz runs in the browser, so scores are useful for practice but aren't tamper-proof and should not be used for grades or high-stakes decisions. Supabase administrators can inspect the database in the dashboard; treat that access as sensitive.

## Troubleshooting

- **Account form says Supabase needs setup:** The app build is missing `VITE_SUPABASE_URL` or `VITE_SUPABASE_PUBLISHABLE_KEY`. Add both and restart local Vite or redeploy Vercel.
- **Invalid API key:** Copy the publishable key, not the secret key or database password. Check for spaces or missing characters.
- **Email confirmation link redirects incorrectly:** Set Site URL and add the exact local/production Redirect URLs. Then request a new confirmation email.
- **Sign-up works but progress doesn't save:** Confirm the SQL migration succeeded, RLS is enabled, and the browser console/network response doesn't show a policy error. Don't fix this by disabling RLS.
- **No email arrives:** Check spam and the Supabase Auth logs; the built-in sender is rate-limited and best-effort. A custom SMTP provider may be needed for reliable class use.
- **Supabase project was paused:** Free projects with low database activity can pause. Resume it from the Supabase dashboard.

Supabase's dashboard labels may change over time. The authoritative references are [API keys](https://supabase.com/docs/guides/getting-started/api-keys), [password-based Auth](https://supabase.com/docs/guides/auth/passwords), and [Auth redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls).
