-- supabase/migrations/0002_next_of_kin_and_bank.sql
-- Adds Next-of-Kin and Bank-account (USD salary) fields to submissions.
-- These are sensitive/financial data; they live in the same private, RLS-locked
-- `submissions` table (deny-all to anon/authenticated) as the passport data, so
-- no new access policy is required.
--
-- `not null default ''` backfills any existing rows safely and is idempotent
-- (`if not exists`); the app enforces the real required values via Zod on submit.

alter table public.submissions
  add column if not exists nok_name text not null default '',
  add column if not exists nok_relationship text not null default '',
  add column if not exists nok_address text not null default '',
  add column if not exists nok_contact text not null default '',
  add column if not exists insurance_beneficiary text not null default '',
  add column if not exists bank_beneficiary_name text not null default '',
  add column if not exists bank_name text not null default '',
  add column if not exists bank_branch text not null default '',
  add column if not exists bank_address text not null default '',
  add column if not exists bank_account_number text not null default '',
  add column if not exists bank_swift text not null default '',
  add column if not exists bank_currency text not null default '';
