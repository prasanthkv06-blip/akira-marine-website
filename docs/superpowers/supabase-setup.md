# New-Joiner Onboarding — Supabase Setup & Go-Live Guide

This feature collects new-joiner details + passport/photo uploads into **Supabase**
(managed Postgres + private Storage) and lets the owner review them at `/admin`.
The code is built; these are the one-time steps to make it live.

> **Sensitive data.** This stores passport scans and photos. Keep the
> `service_role` key secret (server-only), don't share admin access, and delete
> records when they're no longer needed (see Retention below).

## 1. Create a Supabase project
1. Go to **supabase.com** → sign in → **New project**.
2. Pick a nearby region (e.g. **Frankfurt (eu-central-1)** for the UAE).
3. Set a strong database password (you won't need it day-to-day).

## 2. Create the tables, security rules, and storage bucket
1. In the project, open **SQL Editor** → **New query**.
2. Paste the entire contents of [`supabase/migrations/0001_onboarding.sql`](../../supabase/migrations/0001_onboarding.sql) and click **Run**.
3. This creates the `invites` + `submissions` tables, locks them with Row-Level
   Security (only the server can read/write — the public can't), and creates the
   **private** `onboarding-docs` storage bucket.
4. Verify: **Table editor** shows `invites` and `submissions`; **Storage** shows
   an `onboarding-docs` bucket marked **Private**.

## 3. Copy the API keys
**Settings → API**, copy three values:
- **Project URL** (e.g. `https://abcd.supabase.co`)
- **anon public** key
- **service_role** key ← secret; never put this in the browser/client

## 4. Add environment variables in Vercel
**Vercel → your project → Settings → Environment Variables** — add these for
**Production** (and Preview if you use it):

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | the Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | the anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | the service_role key (secret) |
| `ADMIN_OWNER_EMAIL` | `prasanthkv06@gmail.com` (the only email allowed into `/admin`) |
| `NEXT_PUBLIC_APP_URL` | `https://akiramarinesolutions.com` |

`RESEND_API_KEY` should already be set (used by the contact form) — it also sends
the "new submission" notification. Redeploy after adding the variables.

## 5. Turn on owner login (magic link)
1. Supabase → **Authentication → Providers** → ensure **Email** is enabled.
2. **Authentication → URL Configuration**:
   - **Site URL:** `https://akiramarinesolutions.com`
   - **Redirect URLs:** add `https://akiramarinesolutions.com/auth/callback`
3. (Optional) restrict sign-ups — only `ADMIN_OWNER_EMAIL` can pass the admin
   guard regardless, so this is belt-and-braces.

## How to use it
- **Invite a joiner:** go to `https://akiramarinesolutions.com/admin` → sign in
  (magic link to your email) → enter the joiner's name + email → **Copy** the
  generated link → send it to them. Each link is single-use and expires in 14 days.
- **They fill the form** at that link (details + photo + passport front/back +
  consent) and submit. You get an email that a submission arrived.
- **Review:** `/admin/submissions` → open a record → view/download the photo and
  passport pages (links are short-lived signed URLs) → **Delete** when done.

## Retention (data-protection)
Delete a submission (which also deletes its stored files) once it's no longer
needed. Suggested policy: purge non-hired candidates within **90 days** of the
hiring decision; for hired candidates, move the passport scans into your formal
HR file and delete the record here once transferred.

## Manual go-live checklist
- [ ] Migration run; `onboarding-docs` bucket shows **Private**.
- [ ] All 5 env vars set in Vercel (+ `RESEND_API_KEY`); redeployed.
- [ ] Email auth enabled; Site URL + `/auth/callback` redirect configured.
- [ ] Sign in at `/admin` with the owner email works; a non-owner email cannot get in.
- [ ] Create an invite → open the link → submit a test entry with sample files.
- [ ] Owner receives the notification email (no passport data in it — just name + link).
- [ ] Submission appears in `/admin/submissions`; photo + passport pages open via the signed links.
- [ ] Delete the test record → its files are gone from Storage too.
- [ ] Sanity: opening a stored file's raw (unsigned) URL is **denied** (bucket is private).
