# New-Joiner Onboarding Collection — Design Spec

- **Date:** 2026-07-09
- **Status:** Approved (design), pending implementation plan
- **Owner:** Prasanth (Akira Marine Solutions)
- **Repo/app:** `akira-marine` (Next.js 16, App Router, Vercel)

## 1. Purpose

Give Akira a secure, branded way to collect a new joiner's personal, passport,
and experience details plus document uploads (photograph, passport front/back),
store them in a managed database, and let the owner review and download them.

The data is **sensitive identity information**, so the design prioritises
security, access control, consent, and a retention policy over feature breadth.

## 2. Users & flow

Two roles: the **owner/admin** (Prasanth) and the **new joiner** (invitee).

```
Owner                         New joiner                    Owner
─────                         ──────────                    ─────
Log in → /admin               Opens unique link             Email: "New submission
"New invite" (name, email)    Fills branded form            from <name>"
  → copy one-time link  ───►  + uploads photo,        ───►  /admin → open record →
  → send to joiner            passport front/back           view + download files
                              → consent → Submit            → delete when retained
```

- Invite links are **unique per joiner** and **expire after a successful submission**
  (and after a configurable time window, default 14 days).
- Every submission is tied to the invite (so the owner knows who submitted).

## 3. Data collected

All fields required unless marked optional.

**Personal**
- Full legal name (as on passport)
- Date of birth
- Nationality
- Personal email
- Mobile number
- Current address: street, city, country, postcode (postcode optional)

**Passport**
- Passport number
- Issuing country
- Place of issue
- Date of issue
- Date of expiry

**Experience**
- Previous employer (name)
- Job title / role
- Employment dates (from – to)
- Total years of experience

**Reference (previous employer)**
- Reference name
- Reference phone number

**Uploads** (accept JPG/PNG/HEIC/PDF, max 10 MB each)
- Passport-size photograph
- Passport copy — front / bio page
- Passport copy — back page

**Consent**
- Required checkbox with a short privacy notice (what is collected, why, how it is
  stored, and retention). Consent timestamp stored with the submission.

## 4. Architecture

Built into the existing `akira-marine` Next.js app; backend on **Supabase**
(managed Postgres + Storage + Auth).

### Routes
- `GET /onboarding/[token]` — public branded form for a valid, unused invite.
  Invalid/expired/used token → friendly "link no longer valid" state.
- `POST /api/onboarding/submit` — server route: validate → finalise file uploads →
  insert submission → mark invite used → email owner.
- `POST /api/onboarding/upload-url` — server route: for a valid token, return a
  short-lived **signed upload URL** per file so the browser uploads directly to
  Supabase Storage (keeps large files off our server and secrets off the client).
- `/admin` — owner-only. Sub-pages: invites (create/list), submissions (list),
  submission detail (view + signed download links).
- `POST /api/admin/invite` — create an invite, return the link (auth required).
- `GET /api/admin/submissions` + detail — read submissions and mint signed
  download URLs (auth required).

### Supabase
- **Postgres tables**
  - `invites`: `id`, `token` (unguessable), `invitee_name`, `invitee_email`,
    `created_at`, `expires_at`, `used_at`, `status` (`pending|used|expired`).
  - `submissions`: `id`, `invite_id` (FK), all personal/passport/experience/
    reference fields, `photo_path`, `passport_front_path`, `passport_back_path`,
    `consent_at`, `created_at`.
- **Storage:** one **private** bucket `onboarding-docs`, files keyed by
  `submissions/<submission_id>/<field>.<ext>`. No public access.
- **Auth:** Supabase Auth, **magic-link** login; only the owner's email is
  allow-listed for `/admin`.

### Secrets / trust boundary
- The **service-role key** lives only in server routes (Vercel env), never shipped
  to the browser.
- The public form uses only short-lived signed upload URLs + the submit route.
- The browser never reads submission data or holds admin credentials.

## 5. Security & compliance (built in)

- Private Storage bucket; files reachable only via short-lived **signed URLs**
  issued to the authenticated owner.
- **Row-Level Security**: anon/public role can do nothing on `invites`/`submissions`;
  all reads/writes go through server routes using the service role. Public users
  never read others' data.
- Unique, unguessable invite tokens; single-use; time-expiring.
- HTTPS only; Zod validation on every field; file type + size checks (client +
  server); rate limiting on public routes; **no PII in logs**.
- **Consent** captured and timestamped per submission.
- **Retention policy (default, owner-adjustable):** the owner can delete any record
  at any time, which also deletes its Storage files. Recommended policy: purge
  non-hired candidates' data within 90 days of the hiring decision; for hired
  candidates, move passport scans into the formal HR file and delete from this
  system once transferred. (Automated purge is out of scope for v1; manual delete
  is provided.)

## 6. Notifications
- On a successful submission, email the owner (reuse the existing **Resend** setup)
  with a non-sensitive summary (name + a link to the admin record — no passport data
  in the email body).

## 7. Scope

**In (v1)**
- Branded onboarding form + three uploads + consent.
- Unique, single-use, expiring invite links.
- Owner-only admin (Supabase Auth): create invites, list submissions, view/download
  files, delete a record (with its files).
- Email notification to owner.
- The security controls in §5.

**Out (v1) — easy to add later**
- Extra fields (Emirates ID, visa/residence status, emergency contact) — the schema
  is easy to extend; add on request.
- Multi-user HR logins; e-signature; editing a submission after submit; automated
  retention purge; analytics/reporting; PDF export of a record.

## 8. What the owner provides (external setup)

- A free **Supabase** project (owner creates the account — cannot be created on the
  owner's behalf). Then paste into Vercel env:
  `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
  `SUPABASE_SERVICE_ROLE_KEY`. Exact click-by-click steps will be provided.
- Confirm the allow-listed **owner email** for `/admin` login.
- Confirm/adjust the **retention period** (default in §5).

## 9. Testing

- Unit: Zod validation (accept/reject cases), token generation/expiry logic,
  file-type/size guards.
- Integration: submit route (happy path + invalid/used/expired token + oversized/
  wrong-type file), admin auth guard (unauthed → blocked), signed-URL issuance.
- Manual/E2E: full invite → submit → view/download → delete round-trip against a
  Supabase test project; verify files are private (direct URL 403) and only signed
  URLs work.

## 10. Open items to confirm before/at implementation
- Owner email for `/admin` allow-list.
- Retention period (default: 90-day purge for non-hired — §5).
- Any additional fields (Emirates ID / visa / emergency contact) — default: none in v1.
