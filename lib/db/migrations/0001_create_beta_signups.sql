-- Beta signup capture. Run this once against the Supabase project (SQL Editor,
-- or psql "$POSTGRES_URL_NON_POOLING" -f this file).
--
-- Safe to re-run: every statement is guarded.

create table if not exists public.beta_signups (
  id          uuid        primary key default gen_random_uuid(),
  email       text        not null,
  project     text        not null,
  created_at  timestamptz not null default now(),

  -- The server action lowercases before insert; this keeps anything that
  -- bypasses it honest, and makes the unique index case-insensitive.
  constraint beta_signups_email_lowercase check (email = lower(email)),
  constraint beta_signups_email_shape
    check (email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  constraint beta_signups_email_len   check (length(email) <= 254),
  constraint beta_signups_project_len check (length(project) between 1 and 64)
);

-- One signup per experiment; the same person may join several.
create unique index if not exists beta_signups_email_project_key
  on public.beta_signups (email, project);

-- The admin page lists newest first.
create index if not exists beta_signups_created_at_idx
  on public.beta_signups (created_at desc);

-- Tables in `public` are exposed through Supabase's auto-generated REST API,
-- and the anon key is published to the browser. RLS with no policies means
-- anon/authenticated can read nothing; the app connects over the pooler as the
-- owner role, which bypasses RLS. Without this line every address collected
-- here is world-readable.
alter table public.beta_signups enable row level security;

revoke all on public.beta_signups from anon, authenticated;
