-- supabase/migrations/0001_onboarding.sql

create extension if not exists "pgcrypto";

create table public.invites (
  id uuid primary key default gen_random_uuid(),
  token text not null unique,
  invitee_name text not null,
  invitee_email text not null,
  status text not null default 'pending' check (status in ('pending','used','expired')),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  used_at timestamptz
);

create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  invite_id uuid not null references public.invites(id) on delete cascade,
  full_name text not null,
  date_of_birth date not null,
  nationality text not null,
  email text not null,
  mobile text not null,
  address_street text not null,
  address_city text not null,
  address_country text not null,
  address_postcode text,
  passport_number text not null,
  passport_issuing_country text not null,
  passport_place_of_issue text not null,
  passport_date_of_issue date not null,
  passport_date_of_expiry date not null,
  prev_employer text not null,
  prev_job_title text not null,
  prev_from date not null,
  prev_to date not null,
  years_experience numeric not null,
  reference_name text not null,
  reference_phone text not null,
  photo_path text not null,
  passport_front_path text not null,
  passport_back_path text not null,
  consent_at timestamptz not null,
  created_at timestamptz not null default now()
);

-- RLS: deny everything to anon/authenticated by default; only the service role
-- (used server-side) can read/write. We enable RLS and add NO permissive policies,
-- so the anon and authenticated roles are fully denied. The service role bypasses RLS.
alter table public.invites enable row level security;
alter table public.submissions enable row level security;

-- Private storage bucket (id must be unique). Run in SQL editor:
insert into storage.buckets (id, name, public)
values ('onboarding-docs', 'onboarding-docs', false)
on conflict (id) do nothing;

-- No storage policies for anon/authenticated => bucket is only reachable via the
-- service role (server) and signed URLs. Do NOT add public policies.
