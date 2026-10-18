-- BrightSteps English: minimal learning schema with student-owned progress.
-- Run this file in Supabase SQL Editor. Lesson examples are bundled in the app;
-- these tables are ready for content managed in Supabase later.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Learner' check (char_length(display_name) between 1 and 40),
  created_at timestamptz not null default now()
);

create table if not exists public.lessons (
  id text primary key,
  title text not null,
  category text not null,
  level text not null default 'Beginner',
  content jsonb not null default '{}'::jsonb,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.exercises (
  id uuid primary key default gen_random_uuid(),
  lesson_id text not null references public.lessons(id) on delete cascade,
  position integer not null check (position >= 0),
  exercise_type text not null check (exercise_type in ('multiple_choice','fill_blank','listening','video','reading')),
  prompt text not null,
  content jsonb not null default '{}'::jsonb,
  unique (lesson_id, position)
);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null,
  score integer not null check (score between 0 and 100),
  answers jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.student_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null,
  best_score integer not null default 0 check (best_score between 0 and 100),
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create index if not exists quiz_attempts_owner_created_idx on public.quiz_attempts(user_id, created_at desc);
create index if not exists student_progress_owner_idx on public.student_progress(user_id);

alter table public.profiles enable row level security;
alter table public.lessons enable row level security;
alter table public.exercises enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.student_progress enable row level security;

drop policy if exists "Students read own profile" on public.profiles;
create policy "Students read own profile" on public.profiles for select to authenticated using (id = (select auth.uid()));
drop policy if exists "Students update own display name" on public.profiles;
create policy "Students update own display name" on public.profiles for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

drop policy if exists "Anyone reads published lessons" on public.lessons;
create policy "Anyone reads published lessons" on public.lessons for select to anon, authenticated using (published = true);
drop policy if exists "Anyone reads exercises for published lessons" on public.exercises;
create policy "Anyone reads exercises for published lessons" on public.exercises for select to anon, authenticated
  using (exists (select 1 from public.lessons l where l.id = lesson_id and l.published = true));

drop policy if exists "Students read own quiz attempts" on public.quiz_attempts;
create policy "Students read own quiz attempts" on public.quiz_attempts for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists "Students insert own quiz attempts" on public.quiz_attempts;
create policy "Students insert own quiz attempts" on public.quiz_attempts for insert to authenticated with check (user_id = (select auth.uid()));

drop policy if exists "Students read own progress" on public.student_progress;
create policy "Students read own progress" on public.student_progress for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists "Students insert own progress" on public.student_progress;
create policy "Students insert own progress" on public.student_progress for insert to authenticated with check (user_id = (select auth.uid()));
drop policy if exists "Students update own progress" on public.student_progress;
create policy "Students update own progress" on public.student_progress for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

-- No client roles, lesson writes, exercise writes, deletes, or cross-student reads.
revoke all on public.profiles, public.lessons, public.exercises, public.quiz_attempts, public.student_progress from anon, authenticated;
grant select, update on public.profiles to authenticated;
grant select on public.lessons, public.exercises to anon, authenticated;
grant select, insert on public.quiz_attempts to authenticated;
grant select, insert, update on public.student_progress to authenticated;

create or replace function public.create_student_profile()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(nullif(left(new.raw_user_meta_data ->> 'display_name', 40), ''), 'Learner'))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile after insert on auth.users
  for each row execute procedure public.create_student_profile();
