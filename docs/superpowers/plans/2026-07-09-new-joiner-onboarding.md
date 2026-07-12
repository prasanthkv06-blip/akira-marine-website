# New-Joiner Onboarding Collection — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a secure, branded new-joiner onboarding form (personal, passport, experience, reference details + photo/passport uploads) with a Supabase backend, unique per-joiner invite links, and an owner-only admin area.

**Architecture:** A branded public form at `/onboarding/[token]` posts to server API routes that use a Supabase **service-role** key (server-only) to write to Postgres and a **private** Storage bucket. Files upload directly to Storage via short-lived **signed upload URLs**. An owner-only `/admin` area (Supabase Auth magic link) creates invites and views/downloads/deletes submissions via signed URLs. Public callers can never read data (RLS denies anon; all access goes through server routes).

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, Zod 4, Resend 6, `@supabase/supabase-js`, `@supabase/ssr`; Vitest for tests.

## Global Constraints

- Next.js `^16.2.10`, React `19.2.3`, Tailwind `^4`, Zod `^4.3.6`, Resend `^6.17.1` — do not downgrade.
- The **service-role key** (`SUPABASE_SERVICE_ROLE_KEY`) is used ONLY in server code (route handlers / server modules). NEVER import it into a client component or expose it to the browser.
- Storage bucket `onboarding-docs` is **private**. Files are served only via short-lived signed URLs to the authenticated owner.
- Every field is validated with Zod on the server. Never trust client input.
- **No PII in logs or emails** — no passport numbers, addresses, or file contents in `console.*` or email bodies.
- Match the existing site design system (cream/ink/copper tokens in `src/app/globals.css`, `Container`, `FormField`, `FormStatus`, Archivo/IBM Plex fonts).
- File uploads: accept `image/jpeg`, `image/png`, `image/heic`, `application/pdf`; max 10 MB each.
- Admin access is restricted to a single allow-listed owner email (`ADMIN_OWNER_EMAIL`).

---

### Task 1: Project setup — dependencies, Vitest, typed env

**Files:**
- Modify: `package.json` (deps + `test` script)
- Create: `vitest.config.ts`
- Create: `src/lib/env.ts`
- Test: `src/lib/env.test.ts`

**Interfaces:**
- Produces: `env` object with typed getters `env.supabaseUrl`, `env.supabaseAnonKey`, `env.supabaseServiceRoleKey`, `env.adminOwnerEmail`, `env.resendApiKey`, `env.appUrl`; and `requireEnv(name: string): string` (throws if missing).

- [ ] **Step 1: Install dependencies**

```bash
cd akira-marine
npm install @supabase/supabase-js@^2 @supabase/ssr@^0.5 nanoid@^5
npm install -D vitest@^2 @vitejs/plugin-react@^4 jsdom@^25
```

- [ ] **Step 2: Add test script to package.json**

In `package.json` `"scripts"`, add: `"test": "vitest run"`, `"test:watch": "vitest"`.

- [ ] **Step 3: Create vitest.config.ts**

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],
  test: { environment: 'node', globals: true },
  resolve: { alias: { '@': resolve(__dirname, 'src') } },
});
```

- [ ] **Step 4: Write the failing test for env**

```ts
// src/lib/env.test.ts
import { describe, it, expect } from 'vitest';
import { requireEnv } from './env';

describe('requireEnv', () => {
  it('returns the value when set', () => {
    process.env.TEST_X = 'hello';
    expect(requireEnv('TEST_X')).toBe('hello');
  });
  it('throws a clear error when missing', () => {
    delete process.env.TEST_MISSING;
    expect(() => requireEnv('TEST_MISSING')).toThrow('TEST_MISSING is not set');
  });
});
```

- [ ] **Step 5: Run test to verify it fails**

Run: `npm test -- src/lib/env.test.ts`
Expected: FAIL ("Cannot find module './env'").

- [ ] **Step 6: Implement src/lib/env.ts**

```ts
export function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is not set`);
  return v;
}

export const env = {
  get supabaseUrl() { return requireEnv('NEXT_PUBLIC_SUPABASE_URL'); },
  get supabaseAnonKey() { return requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'); },
  get supabaseServiceRoleKey() { return requireEnv('SUPABASE_SERVICE_ROLE_KEY'); },
  get adminOwnerEmail() { return requireEnv('ADMIN_OWNER_EMAIL').toLowerCase(); },
  get resendApiKey() { return requireEnv('RESEND_API_KEY'); },
  get appUrl() { return process.env.NEXT_PUBLIC_APP_URL || 'https://akiramarinesolutions.com'; },
};
```

- [ ] **Step 7: Run test to verify it passes**

Run: `npm test -- src/lib/env.test.ts` → Expected: PASS.

- [ ] **Step 8: Create .env.local.example (do NOT commit real secrets)**

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_OWNER_EMAIL=prasanthkv06@gmail.com
NEXT_PUBLIC_APP_URL=https://akiramarinesolutions.com
```

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json vitest.config.ts src/lib/env.ts src/lib/env.test.ts .env.local.example
git commit -m "chore: add supabase + vitest deps and typed env accessor"
```

---

### Task 2: Supabase schema, RLS, and Storage (SQL migration)

**Files:**
- Create: `supabase/migrations/0001_onboarding.sql`
- Create: `docs/superpowers/supabase-setup.md` (run instructions)

**Interfaces:**
- Produces DB tables `public.invites` and `public.submissions` and a private bucket `onboarding-docs`, consumed by all later data-access modules.

This SQL is run once in the Supabase SQL editor (documented in Task 13). It is verified manually, not by a unit test.

- [ ] **Step 1: Write the migration SQL**

```sql
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
```

- [ ] **Step 2: Commit**

```bash
git add supabase/migrations/0001_onboarding.sql
git commit -m "feat: onboarding db schema, RLS lockdown, and private storage bucket"
```

---

### Task 3: Supabase client factories

**Files:**
- Create: `src/lib/supabase/admin.ts`
- Create: `src/lib/supabase/server.ts`
- Test: `src/lib/supabase/admin.test.ts`

**Interfaces:**
- Produces: `getAdminClient(): SupabaseClient` (service-role, server-only), `getServerClient(): Promise<SupabaseClient>` (cookie-based, for auth session in RSC/route handlers).

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/supabase/admin.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { getAdminClient } from './admin';

describe('getAdminClient', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://x.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-key';
  });
  it('creates a client with from() available', () => {
    const c = getAdminClient();
    expect(typeof c.from).toBe('function');
    expect(typeof c.storage.from).toBe('function');
  });
});
```

- [ ] **Step 2: Run test → Expected: FAIL** (`Cannot find module './admin'`). Run: `npm test -- src/lib/supabase/admin.test.ts`

- [ ] **Step 3: Implement admin.ts and server.ts**

```ts
// src/lib/supabase/admin.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';

// Server-only. Uses the service-role key; bypasses RLS. NEVER import in client code.
export function getAdminClient(): SupabaseClient {
  return createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
```

```ts
// src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { env } from '@/lib/env';

// Cookie-based client for reading the owner's auth session in RSC / route handlers.
export async function getServerClient() {
  const cookieStore = await cookies();
  return createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (list) => list.forEach(({ name, value, options }) => cookieStore.set(name, value, options)),
    },
  });
}
```

- [ ] **Step 4: Run test → Expected: PASS.**

- [ ] **Step 5: Commit**

```bash
git add src/lib/supabase/
git commit -m "feat: supabase admin (service-role) and server (auth) client factories"
```

---

### Task 4: Validation schemas, types, and file constraints

**Files:**
- Create: `src/lib/onboarding/types.ts`
- Create: `src/lib/onboarding/schema.ts`
- Test: `src/lib/onboarding/schema.test.ts`

**Interfaces:**
- Produces: `FILE_CONSTRAINTS` (`{ maxBytes: number; accept: string[] }`), `fileMetaSchema`, `onboardingSubmissionSchema` (Zod) and `type OnboardingSubmission = z.infer<...>`; `InviteRow`, `SubmissionRow` types.

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/onboarding/schema.test.ts
import { describe, it, expect } from 'vitest';
import { onboardingSubmissionSchema, fileMetaSchema, FILE_CONSTRAINTS } from './schema';

const valid = {
  fullName: 'John Smith', dateOfBirth: '1990-05-01', nationality: 'Indian',
  email: 'john@example.com', mobile: '+971500000000',
  addressStreet: '1 Road', addressCity: 'Abu Dhabi', addressCountry: 'UAE', addressPostcode: '',
  passportNumber: 'A1234567', passportIssuingCountry: 'India', passportPlaceOfIssue: 'Delhi',
  passportDateOfIssue: '2018-01-01', passportDateOfExpiry: '2028-01-01',
  prevEmployer: 'Acme', prevJobTitle: 'Engineer', prevFrom: '2015-01-01', prevTo: '2020-01-01',
  yearsExperience: 5, referenceName: 'Jane', referencePhone: '+911111111111',
  photoPath: 'onboarding/abc/photo-1.jpg',
  passportFrontPath: 'onboarding/abc/passport_front-1.jpg',
  passportBackPath: 'onboarding/abc/passport_back-1.jpg',
  consent: true,
};

describe('onboardingSubmissionSchema', () => {
  it('accepts a fully valid submission', () => {
    expect(onboardingSubmissionSchema.safeParse(valid).success).toBe(true);
  });
  it('rejects a bad email', () => {
    expect(onboardingSubmissionSchema.safeParse({ ...valid, email: 'nope' }).success).toBe(false);
  });
  it('rejects missing required field', () => {
    const { fullName, ...rest } = valid;
    expect(onboardingSubmissionSchema.safeParse(rest).success).toBe(false);
  });
  it('rejects when consent is false', () => {
    expect(onboardingSubmissionSchema.safeParse({ ...valid, consent: false }).success).toBe(false);
  });
});

describe('fileMetaSchema', () => {
  it('rejects oversized files', () => {
    const r = fileMetaSchema.safeParse({ field: 'photo', filename: 'a.jpg', contentType: 'image/jpeg', size: FILE_CONSTRAINTS.maxBytes + 1 });
    expect(r.success).toBe(false);
  });
  it('rejects disallowed content types', () => {
    const r = fileMetaSchema.safeParse({ field: 'photo', filename: 'a.exe', contentType: 'application/x-msdownload', size: 100 });
    expect(r.success).toBe(false);
  });
  it('accepts a valid pdf under the limit', () => {
    const r = fileMetaSchema.safeParse({ field: 'passportFront', filename: 'p.pdf', contentType: 'application/pdf', size: 1000 });
    expect(r.success).toBe(true);
  });
});
```

- [ ] **Step 2: Run test → Expected: FAIL.** Run: `npm test -- src/lib/onboarding/schema.test.ts`

- [ ] **Step 3: Implement types.ts and schema.ts**

```ts
// src/lib/onboarding/types.ts
export interface InviteRow {
  id: string; token: string; invitee_name: string; invitee_email: string;
  status: 'pending' | 'used' | 'expired'; created_at: string; expires_at: string; used_at: string | null;
}
export interface SubmissionRow {
  id: string; invite_id: string; full_name: string; created_at: string;
  photo_path: string; passport_front_path: string; passport_back_path: string;
  [key: string]: unknown;
}
```

```ts
// src/lib/onboarding/schema.ts
import { z } from 'zod';

export const FILE_CONSTRAINTS = {
  maxBytes: 10 * 1024 * 1024,
  accept: ['image/jpeg', 'image/png', 'image/heic', 'application/pdf'],
} as const;

export const UPLOAD_FIELDS = ['photo', 'passportFront', 'passportBack'] as const;
export type UploadField = (typeof UPLOAD_FIELDS)[number];

export const fileMetaSchema = z.object({
  field: z.enum(UPLOAD_FIELDS),
  filename: z.string().min(1).max(200),
  contentType: z.string().refine((t) => FILE_CONSTRAINTS.accept.includes(t), 'Unsupported file type'),
  size: z.number().int().positive().max(FILE_CONSTRAINTS.maxBytes, 'File too large (max 10 MB)'),
});
export type FileMeta = z.infer<typeof fileMetaSchema>;

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date');
const storagePath = z.string().min(1).max(300);

export const onboardingSubmissionSchema = z.object({
  fullName: z.string().min(1).max(120),
  dateOfBirth: isoDate,
  nationality: z.string().min(1).max(60),
  email: z.string().email(),
  mobile: z.string().min(5).max(30),
  addressStreet: z.string().min(1).max(160),
  addressCity: z.string().min(1).max(80),
  addressCountry: z.string().min(1).max(80),
  addressPostcode: z.string().max(20).optional().or(z.literal('')),
  passportNumber: z.string().min(3).max(20),
  passportIssuingCountry: z.string().min(1).max(60),
  passportPlaceOfIssue: z.string().min(1).max(80),
  passportDateOfIssue: isoDate,
  passportDateOfExpiry: isoDate,
  prevEmployer: z.string().min(1).max(120),
  prevJobTitle: z.string().min(1).max(120),
  prevFrom: isoDate,
  prevTo: isoDate,
  yearsExperience: z.number().min(0).max(70),
  referenceName: z.string().min(1).max(120),
  referencePhone: z.string().min(5).max(30),
  photoPath: storagePath,
  passportFrontPath: storagePath,
  passportBackPath: storagePath,
  consent: z.literal(true),
});
export type OnboardingSubmission = z.infer<typeof onboardingSubmissionSchema>;
```

- [ ] **Step 4: Run test → Expected: PASS.**

- [ ] **Step 5: Commit**

```bash
git add src/lib/onboarding/types.ts src/lib/onboarding/schema.ts src/lib/onboarding/schema.test.ts
git commit -m "feat: onboarding validation schemas, file constraints, and row types"
```

---

### Task 5: Invite token logic + data access

**Files:**
- Create: `src/lib/onboarding/invites.ts`
- Test: `src/lib/onboarding/invites.test.ts`

**Interfaces:**
- Produces:
  - `generateInviteToken(): string` (URL-safe, ≥ 32 chars)
  - `isInviteUsable(invite: InviteRow, now: Date): boolean` (pure — pending, not expired, not used)
  - `createInvite(input: { name: string; email: string; ttlDays?: number }): Promise<{ id: string; token: string; url: string }>`
  - `getInviteByToken(token: string): Promise<InviteRow | null>`
  - `markInviteUsed(id: string): Promise<void>`

- [ ] **Step 1: Write the failing test (pure logic only)**

```ts
// src/lib/onboarding/invites.test.ts
import { describe, it, expect } from 'vitest';
import { generateInviteToken, isInviteUsable } from './invites';
import type { InviteRow } from './types';

const base: InviteRow = {
  id: '1', token: 't', invitee_name: 'A', invitee_email: 'a@b.com',
  status: 'pending', created_at: '2026-01-01T00:00:00Z',
  expires_at: '2026-01-15T00:00:00Z', used_at: null,
};
const now = new Date('2026-01-10T00:00:00Z');

describe('generateInviteToken', () => {
  it('is url-safe and long', () => {
    const t = generateInviteToken();
    expect(t).toMatch(/^[A-Za-z0-9_-]{32,}$/);
  });
  it('is unique across calls', () => {
    expect(generateInviteToken()).not.toBe(generateInviteToken());
  });
});

describe('isInviteUsable', () => {
  it('true for pending, unexpired, unused', () => {
    expect(isInviteUsable(base, now)).toBe(true);
  });
  it('false when used', () => {
    expect(isInviteUsable({ ...base, status: 'used', used_at: '2026-01-05T00:00:00Z' }, now)).toBe(false);
  });
  it('false when expired', () => {
    expect(isInviteUsable({ ...base, expires_at: '2026-01-05T00:00:00Z' }, now)).toBe(false);
  });
});
```

- [ ] **Step 2: Run test → Expected: FAIL.** Run: `npm test -- src/lib/onboarding/invites.test.ts`

- [ ] **Step 3: Implement invites.ts**

```ts
// src/lib/onboarding/invites.ts
import { nanoid } from 'nanoid';
import { getAdminClient } from '@/lib/supabase/admin';
import { env } from '@/lib/env';
import type { InviteRow } from './types';

export function generateInviteToken(): string {
  return nanoid(40); // url-safe alphabet
}

export function isInviteUsable(invite: InviteRow, now: Date): boolean {
  return invite.status === 'pending'
    && invite.used_at === null
    && new Date(invite.expires_at).getTime() > now.getTime();
}

export async function createInvite(input: { name: string; email: string; ttlDays?: number }) {
  const token = generateInviteToken();
  const ttl = input.ttlDays ?? 14;
  const expires = new Date(Date.now() + ttl * 24 * 60 * 60 * 1000).toISOString();
  const db = getAdminClient();
  const { data, error } = await db.from('invites').insert({
    token, invitee_name: input.name, invitee_email: input.email, expires_at: expires,
  }).select('id').single();
  if (error) throw new Error(`createInvite failed: ${error.message}`);
  return { id: data.id as string, token, url: `${env.appUrl}/onboarding/${token}` };
}

export async function getInviteByToken(token: string): Promise<InviteRow | null> {
  const db = getAdminClient();
  const { data } = await db.from('invites').select('*').eq('token', token).maybeSingle();
  return (data as InviteRow) ?? null;
}

export async function markInviteUsed(id: string): Promise<void> {
  const db = getAdminClient();
  const { error } = await db.from('invites')
    .update({ status: 'used', used_at: new Date().toISOString() }).eq('id', id);
  if (error) throw new Error(`markInviteUsed failed: ${error.message}`);
}
```

- [ ] **Step 4: Run test → Expected: PASS.**

- [ ] **Step 5: Commit**

```bash
git add src/lib/onboarding/invites.ts src/lib/onboarding/invites.test.ts
git commit -m "feat: invite token generation, usability rules, and data access"
```

---

### Task 6: Owner auth allow-list + guard

**Files:**
- Create: `src/lib/auth/owner.ts`
- Test: `src/lib/auth/owner.test.ts`

**Interfaces:**
- Produces: `isOwnerEmail(email: string | null | undefined): boolean` (pure), `getOwnerSession(): Promise<{ email: string } | null>` (reads Supabase session, returns only if owner).

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/auth/owner.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { isOwnerEmail } from './owner';

describe('isOwnerEmail', () => {
  beforeEach(() => { process.env.ADMIN_OWNER_EMAIL = 'Owner@Akira.com'; });
  it('matches case-insensitively', () => { expect(isOwnerEmail('owner@akira.com')).toBe(true); });
  it('rejects a different email', () => { expect(isOwnerEmail('someone@else.com')).toBe(false); });
  it('rejects null/empty', () => { expect(isOwnerEmail(null)).toBe(false); expect(isOwnerEmail('')).toBe(false); });
});
```

- [ ] **Step 2: Run test → Expected: FAIL.** Run: `npm test -- src/lib/auth/owner.test.ts`

- [ ] **Step 3: Implement owner.ts**

```ts
// src/lib/auth/owner.ts
import { getServerClient } from '@/lib/supabase/server';
import { env } from '@/lib/env';

export function isOwnerEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.toLowerCase() === env.adminOwnerEmail;
}

export async function getOwnerSession(): Promise<{ email: string } | null> {
  const supabase = await getServerClient();
  const { data } = await supabase.auth.getUser();
  const email = data.user?.email ?? null;
  return isOwnerEmail(email) ? { email: email as string } : null;
}
```

- [ ] **Step 4: Run test → Expected: PASS.**

- [ ] **Step 5: Commit**

```bash
git add src/lib/auth/owner.ts src/lib/auth/owner.test.ts
git commit -m "feat: owner email allow-list and session guard"
```

---

### Task 7: Submissions data access (create, list, get, sign, delete)

**Files:**
- Create: `src/lib/onboarding/submissions.ts`
- Test: `src/lib/onboarding/submissions.test.ts`

**Interfaces:**
- Produces:
  - `pathBelongsToInvite(path: string, inviteId: string): boolean` (pure — enforces `onboarding/<inviteId>/` prefix)
  - `createSubmission(inviteId: string, data: OnboardingSubmission): Promise<{ id: string }>`
  - `listSubmissions(): Promise<Array<{ id: string; full_name: string; created_at: string }>>`
  - `getSubmission(id: string): Promise<SubmissionRow | null>`
  - `signDownloadUrl(path: string): Promise<string>` (60-min signed URL)
  - `deleteSubmission(id: string): Promise<void>` (removes files then row)

- [ ] **Step 1: Write the failing test (pure prefix guard)**

```ts
// src/lib/onboarding/submissions.test.ts
import { describe, it, expect } from 'vitest';
import { pathBelongsToInvite } from './submissions';

describe('pathBelongsToInvite', () => {
  it('accepts a path under the invite folder', () => {
    expect(pathBelongsToInvite('onboarding/abc/photo-1.jpg', 'abc')).toBe(true);
  });
  it('rejects a path for a different invite', () => {
    expect(pathBelongsToInvite('onboarding/xyz/photo-1.jpg', 'abc')).toBe(false);
  });
  it('rejects traversal attempts', () => {
    expect(pathBelongsToInvite('onboarding/abc/../xyz/p.jpg', 'abc')).toBe(false);
  });
});
```

- [ ] **Step 2: Run test → Expected: FAIL.** Run: `npm test -- src/lib/onboarding/submissions.test.ts`

- [ ] **Step 3: Implement submissions.ts**

```ts
// src/lib/onboarding/submissions.ts
import { getAdminClient } from '@/lib/supabase/admin';
import type { OnboardingSubmission } from './schema';
import type { SubmissionRow } from './types';

const BUCKET = 'onboarding-docs';

export function pathBelongsToInvite(path: string, inviteId: string): boolean {
  if (path.includes('..')) return false;
  return path.startsWith(`onboarding/${inviteId}/`);
}

export async function createSubmission(inviteId: string, d: OnboardingSubmission) {
  const db = getAdminClient();
  const { data, error } = await db.from('submissions').insert({
    invite_id: inviteId,
    full_name: d.fullName, date_of_birth: d.dateOfBirth, nationality: d.nationality,
    email: d.email, mobile: d.mobile,
    address_street: d.addressStreet, address_city: d.addressCity,
    address_country: d.addressCountry, address_postcode: d.addressPostcode || null,
    passport_number: d.passportNumber, passport_issuing_country: d.passportIssuingCountry,
    passport_place_of_issue: d.passportPlaceOfIssue, passport_date_of_issue: d.passportDateOfIssue,
    passport_date_of_expiry: d.passportDateOfExpiry,
    prev_employer: d.prevEmployer, prev_job_title: d.prevJobTitle,
    prev_from: d.prevFrom, prev_to: d.prevTo, years_experience: d.yearsExperience,
    reference_name: d.referenceName, reference_phone: d.referencePhone,
    photo_path: d.photoPath, passport_front_path: d.passportFrontPath, passport_back_path: d.passportBackPath,
    consent_at: new Date().toISOString(),
  }).select('id').single();
  if (error) throw new Error(`createSubmission failed: ${error.message}`);
  return { id: data.id as string };
}

export async function listSubmissions() {
  const db = getAdminClient();
  const { data, error } = await db.from('submissions')
    .select('id, full_name, created_at').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data as Array<{ id: string; full_name: string; created_at: string }>;
}

export async function getSubmission(id: string): Promise<SubmissionRow | null> {
  const db = getAdminClient();
  const { data } = await db.from('submissions').select('*').eq('id', id).maybeSingle();
  return (data as SubmissionRow) ?? null;
}

export async function signDownloadUrl(path: string): Promise<string> {
  const db = getAdminClient();
  const { data, error } = await db.storage.from(BUCKET).createSignedUrl(path, 60 * 60);
  if (error || !data) throw new Error(`signDownloadUrl failed: ${error?.message}`);
  return data.signedUrl;
}

export async function deleteSubmission(id: string): Promise<void> {
  const db = getAdminClient();
  const row = await getSubmission(id);
  if (!row) return;
  await db.storage.from(BUCKET).remove([row.photo_path, row.passport_front_path, row.passport_back_path]);
  const { error } = await db.from('submissions').delete().eq('id', id);
  if (error) throw new Error(`deleteSubmission failed: ${error.message}`);
}
```

- [ ] **Step 4: Run test → Expected: PASS.**

- [ ] **Step 5: Commit**

```bash
git add src/lib/onboarding/submissions.ts src/lib/onboarding/submissions.test.ts
git commit -m "feat: submissions data access with invite-scoped path guard and signed downloads"
```

---

### Task 8: Email notification (Resend)

**Files:**
- Create: `src/lib/onboarding/notify.ts`
- Test: `src/lib/onboarding/notify.test.ts`

**Interfaces:**
- Produces: `buildNotificationEmail(input: { name: string; submissionId: string }): { subject: string; html: string }` (pure, **no PII beyond name**), and `sendSubmissionNotification(input): Promise<void>`.

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/onboarding/notify.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { buildNotificationEmail } from './notify';

describe('buildNotificationEmail', () => {
  beforeEach(() => { process.env.NEXT_PUBLIC_APP_URL = 'https://akiramarinesolutions.com'; });
  it('includes the name and an admin link, but no passport data', () => {
    const { subject, html } = buildNotificationEmail({ name: 'John Smith', submissionId: 'sub-1' });
    expect(subject).toContain('John Smith');
    expect(html).toContain('/admin/submissions/sub-1');
    expect(html).not.toMatch(/passport/i);
  });
});
```

- [ ] **Step 2: Run test → Expected: FAIL.** Run: `npm test -- src/lib/onboarding/notify.test.ts`

- [ ] **Step 3: Implement notify.ts**

```ts
// src/lib/onboarding/notify.ts
import { Resend } from 'resend';
import { env } from '@/lib/env';

export function buildNotificationEmail(input: { name: string; submissionId: string }) {
  const url = `${env.appUrl}/admin/submissions/${input.submissionId}`;
  return {
    subject: `New onboarding submission — ${input.name}`,
    html: `<p>A new joiner has submitted their onboarding details.</p>
<p><strong>${input.name}</strong></p>
<p>Review it in the admin area: <a href="${url}">${url}</a></p>`,
  };
}

export async function sendSubmissionNotification(input: { name: string; submissionId: string }) {
  const { subject, html } = buildNotificationEmail(input);
  const resend = new Resend(env.resendApiKey);
  await resend.emails.send({
    from: 'Akira Onboarding <onboarding@akiramarinesolutions.com>',
    to: env.adminOwnerEmail, subject, html,
  });
}
```

- [ ] **Step 4: Run test → Expected: PASS.**

- [ ] **Step 5: Commit**

```bash
git add src/lib/onboarding/notify.ts src/lib/onboarding/notify.test.ts
git commit -m "feat: submission email notification (no PII in body)"
```

---

### Task 9: API route — signed upload URL (public, token-gated)

**Files:**
- Create: `src/app/api/onboarding/upload-url/route.ts`
- Create: `src/lib/onboarding/uploads.ts`
- Test: `src/lib/onboarding/uploads.test.ts`

**Interfaces:**
- Consumes: `getInviteByToken`, `isInviteusable`, `fileMetaSchema`, `getAdminClient`.
- Produces: `buildObjectPath(inviteId: string, field: UploadField, filename: string): string` (pure), and route `POST /api/onboarding/upload-url` returning `{ uploadUrl: string; token: string; path: string }` (Supabase signed upload URL).

- [ ] **Step 1: Write the failing test for path building**

```ts
// src/lib/onboarding/uploads.test.ts
import { describe, it, expect } from 'vitest';
import { buildObjectPath } from './uploads';

describe('buildObjectPath', () => {
  it('nests under the invite folder with the field and a safe extension', () => {
    const p = buildObjectPath('abc', 'photo', 'My Pic.JPG');
    expect(p).toMatch(/^onboarding\/abc\/photo-[A-Za-z0-9_-]+\.jpg$/);
  });
  it('defaults unknown extensions to bin', () => {
    expect(buildObjectPath('abc', 'passportBack', 'file')).toMatch(/passportBack-.+\.bin$/);
  });
});
```

- [ ] **Step 2: Run test → Expected: FAIL.** Run: `npm test -- src/lib/onboarding/uploads.test.ts`

- [ ] **Step 3: Implement uploads.ts**

```ts
// src/lib/onboarding/uploads.ts
import { nanoid } from 'nanoid';
import type { UploadField } from './schema';

const ALLOWED_EXT = new Set(['jpg', 'jpeg', 'png', 'heic', 'pdf']);

export function buildObjectPath(inviteId: string, field: UploadField, filename: string): string {
  const raw = (filename.split('.').pop() ?? '').toLowerCase();
  const ext = ALLOWED_EXT.has(raw) ? (raw === 'jpeg' ? 'jpg' : raw) : 'bin';
  return `onboarding/${inviteId}/${field}-${nanoid(10)}.${ext}`;
}
```

- [ ] **Step 4: Run test → Expected: PASS.**

- [ ] **Step 5: Implement the route handler**

```ts
// src/app/api/onboarding/upload-url/route.ts
import { NextResponse } from 'next/server';
import { getInviteByToken, isInviteUsable } from '@/lib/onboarding/invites';
import { fileMetaSchema } from '@/lib/onboarding/schema';
import { buildObjectPath } from '@/lib/onboarding/uploads';
import { getAdminClient } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const token = typeof body?.token === 'string' ? body.token : '';
  const meta = fileMetaSchema.safeParse(body?.file);
  if (!token || !meta.success) return NextResponse.json({ error: 'Invalid request' }, { status: 422 });

  const invite = await getInviteByToken(token);
  if (!invite || !isInviteUsable(invite, new Date())) {
    return NextResponse.json({ error: 'This link is no longer valid.' }, { status: 403 });
  }

  const path = buildObjectPath(invite.id, meta.data.field, meta.data.filename);
  const { data, error } = await getAdminClient().storage
    .from('onboarding-docs').createSignedUploadUrl(path);
  if (error || !data) return NextResponse.json({ error: 'Upload init failed' }, { status: 500 });
  return NextResponse.json({ uploadUrl: data.signedUrl, token: data.token, path });
}
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/onboarding/uploads.ts src/lib/onboarding/uploads.test.ts src/app/api/onboarding/upload-url/route.ts
git commit -m "feat: token-gated signed upload URL endpoint"
```

---

### Task 10: API route — submit (public, token-gated)

**Files:**
- Create: `src/app/api/onboarding/submit/route.ts`

**Interfaces:**
- Consumes: `onboardingSubmissionSchema`, `getInviteByToken`, `isInviteUsable`, `pathBelongsToInvite`, `createSubmission`, `markInviteUsed`, `sendSubmissionNotification`.
- Produces: `POST /api/onboarding/submit` → `{ ok: true }` (201) or error status.

- [ ] **Step 1: Implement the route (verified by the integration test in Step 2)**

```ts
// src/app/api/onboarding/submit/route.ts
import { NextResponse } from 'next/server';
import { onboardingSubmissionSchema } from '@/lib/onboarding/schema';
import { getInviteByToken, isInviteUsable, markInviteUsed } from '@/lib/onboarding/invites';
import { createSubmission, pathBelongsToInvite } from '@/lib/onboarding/submissions';
import { sendSubmissionNotification } from '@/lib/onboarding/notify';

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const token = typeof body?.token === 'string' ? body.token : '';
  const parsed = onboardingSubmissionSchema.safeParse(body?.data);
  if (!token || !parsed.success) return NextResponse.json({ error: 'Invalid submission' }, { status: 422 });

  const invite = await getInviteByToken(token);
  if (!invite || !isInviteUsable(invite, new Date())) {
    return NextResponse.json({ error: 'This link is no longer valid.' }, { status: 403 });
  }

  const d = parsed.data;
  const paths = [d.photoPath, d.passportFrontPath, d.passportBackPath];
  if (!paths.every((p) => pathBelongsToInvite(p, invite.id))) {
    return NextResponse.json({ error: 'Invalid file references' }, { status: 400 });
  }

  const { id } = await createSubmission(invite.id, d);
  await markInviteUsed(invite.id);
  try { await sendSubmissionNotification({ name: d.fullName, submissionId: id }); }
  catch { console.warn('[onboarding] notification email failed to send'); }

  return NextResponse.json({ ok: true }, { status: 201 });
}
```

- [ ] **Step 2: Write an integration test (mock the data-access + notify modules)**

```ts
// src/app/api/onboarding/submit/route.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/onboarding/invites', () => ({
  getInviteByToken: vi.fn(),
  isInviteUsable: vi.fn(() => true),
  markInviteUsed: vi.fn(),
}));
vi.mock('@/lib/onboarding/submissions', async (orig) => ({
  ...(await orig<any>()),
  createSubmission: vi.fn(async () => ({ id: 'sub-1' })),
}));
vi.mock('@/lib/onboarding/notify', () => ({ sendSubmissionNotification: vi.fn() }));

import { POST } from './route';
import { getInviteByToken, markInviteUsed } from '@/lib/onboarding/invites';

const valid = { /* copy the `valid` object from schema.test.ts */ } as any;

function reqWith(payload: unknown) {
  return new Request('http://x/api/onboarding/submit', { method: 'POST', body: JSON.stringify(payload) });
}

describe('POST /api/onboarding/submit', () => {
  beforeEach(() => vi.clearAllMocks());
  it('403 when the token is invalid', async () => {
    (getInviteByToken as any).mockResolvedValue(null);
    const res = await POST(reqWith({ token: 'bad', data: valid }));
    expect(res.status).toBe(403);
  });
  it('422 when the body is invalid', async () => {
    (getInviteByToken as any).mockResolvedValue({ id: 'abc' });
    const res = await POST(reqWith({ token: 't', data: { ...valid, email: 'no' } }));
    expect(res.status).toBe(422);
  });
  it('201 and marks invite used on the happy path', async () => {
    (getInviteByToken as any).mockResolvedValue({ id: 'abc' });
    const good = { ...valid, photoPath: 'onboarding/abc/photo-1.jpg',
      passportFrontPath: 'onboarding/abc/passport_front-1.jpg',
      passportBackPath: 'onboarding/abc/passport_back-1.jpg' };
    const res = await POST(reqWith({ token: 't', data: good }));
    expect(res.status).toBe(201);
    expect(markInviteUsed).toHaveBeenCalledWith('abc');
  });
});
```

> Note: paste the concrete `valid` object from Task 4's test (same field values) so this file is self-contained.

- [ ] **Step 3: Run tests → Expected: PASS.** Run: `npm test -- src/app/api/onboarding/submit/route.test.ts`

- [ ] **Step 4: Commit**

```bash
git add src/app/api/onboarding/submit/
git commit -m "feat: token-gated onboarding submit endpoint with validation + notify"
```

---

### Task 11: API route — create invite (admin, auth-guarded)

**Files:**
- Create: `src/app/api/admin/invite/route.ts`

**Interfaces:**
- Consumes: `getOwnerSession`, `createInvite`.
- Produces: `POST /api/admin/invite` → `{ url: string }` (200) or 401.

- [ ] **Step 1: Implement the route**

```ts
// src/app/api/admin/invite/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getOwnerSession } from '@/lib/auth/owner';
import { createInvite } from '@/lib/onboarding/invites';

const schema = z.object({ name: z.string().min(1).max(120), email: z.string().email() });

export async function POST(req: Request) {
  if (!(await getOwnerSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 422 });
  const { url } = await createInvite({ name: parsed.data.name, email: parsed.data.email });
  return NextResponse.json({ url });
}
```

- [ ] **Step 2: Write an integration test (mock owner + createInvite)**

```ts
// src/app/api/admin/invite/route.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
vi.mock('@/lib/auth/owner', () => ({ getOwnerSession: vi.fn() }));
vi.mock('@/lib/onboarding/invites', () => ({ createInvite: vi.fn(async () => ({ url: 'https://x/onboarding/tok' })) }));
import { POST } from './route';
import { getOwnerSession } from '@/lib/auth/owner';

const req = (b: unknown) => new Request('http://x', { method: 'POST', body: JSON.stringify(b) });

describe('POST /api/admin/invite', () => {
  beforeEach(() => vi.clearAllMocks());
  it('401 when not the owner', async () => {
    (getOwnerSession as any).mockResolvedValue(null);
    expect((await POST(req({ name: 'A', email: 'a@b.com' }))).status).toBe(401);
  });
  it('returns a url for the owner', async () => {
    (getOwnerSession as any).mockResolvedValue({ email: 'owner@akira.com' });
    const res = await POST(req({ name: 'A', email: 'a@b.com' }));
    expect(res.status).toBe(200);
    expect((await res.json()).url).toContain('/onboarding/');
  });
});
```

- [ ] **Step 3: Run tests → Expected: PASS.**

- [ ] **Step 4: Commit**

```bash
git add src/app/api/admin/invite/
git commit -m "feat: admin invite creation endpoint (owner-guarded)"
```

---

### Task 12: Public onboarding form UI

**Files:**
- Create: `src/app/onboarding/[token]/page.tsx` (server component — validate token, render form or invalid state)
- Create: `src/components/onboarding/OnboardingForm.tsx` (client component)
- Create: `src/components/onboarding/FileDropField.tsx` (client — single file input with validation + upload)

**Interfaces:**
- Consumes: `getInviteByToken`, `isInviteUsable`, `onboardingSubmissionSchema`, `FILE_CONSTRAINTS`, `/api/onboarding/upload-url`, `/api/onboarding/submit`, existing `Container`, `FormField`, `FormStatus`.
- Produces: the joiner-facing experience. No new exported functions consumed elsewhere.

**Behaviour spec (implement to this, matching the site's design tokens):**
- `page.tsx` (server): `const invite = await getInviteByToken(params.token)`. If `!invite || !isInviteUsable(invite, new Date())`, render a centered "This link is no longer valid — please contact Akira Marine Solutions." panel using the site's `PageHero`/`Container` styling. Otherwise render `<OnboardingForm token={params.token} inviteeName={invite.invitee_name} />`.
- `OnboardingForm.tsx` (`'use client'`): React state per field; groups rendered with existing `FormField`. Three `FileDropField`s (photo, passportFront, passportBack). A required consent checkbox with the privacy note. On submit:
  1. For each chosen file: `POST /api/onboarding/upload-url` `{ token, file: { field, filename, contentType, size } }` → get `{ uploadUrl, token, path }`; upload the bytes with `fetch(uploadUrl, { method: 'PUT', body: file, headers: { 'content-type': file.type } })` (Supabase signed upload URL accepts PUT). Keep the returned `path`.
  2. Build the payload object (all fields + the three `path`s + `consent: true`), `POST /api/onboarding/submit` `{ token, data }`.
  3. Validate client-side first with `onboardingSubmissionSchema.safeParse` to show inline errors before hitting the network.
  4. On 201 → success screen ("Thank you — your details have been submitted securely."). On 403 → "link no longer valid". On 422 → show field errors. Use `FormStatus` for the status region (already has `role="status"`).
- `FileDropField.tsx`: an `<input type="file" accept="image/*,application/pdf">`; on change, validate `file.size <= FILE_CONSTRAINTS.maxBytes` and `FILE_CONSTRAINTS.accept.includes(file.type)`, show a thumbnail/filename + a "Remove" button; expose the `File` via an `onChange(file: File | null)` prop. Label + error wired with `aria-invalid`/`aria-describedby` like the existing `FormField`.

- [ ] **Step 1: Build `FileDropField.tsx`** (client file input + validation + preview), following the behaviour spec and the existing `FormField` a11y pattern.
- [ ] **Step 2: Build `OnboardingForm.tsx`** with all fields, the three `FileDropField`s, consent checkbox, and the two-step upload→submit flow above.
- [ ] **Step 3: Build `page.tsx`** (server) with the valid/invalid branching.
- [ ] **Step 4: Manual verify** — with a real Supabase test project + a seeded invite, load `/onboarding/<token>`, submit with sample files, confirm 201 and files land in the private bucket. (Automated E2E lives in Task 15.)
- [ ] **Step 5: Commit**

```bash
git add src/app/onboarding/ src/components/onboarding/
git commit -m "feat: branded public onboarding form with secure uploads"
```

---

### Task 13: Admin UI — login, invites, submissions, detail, delete

**Files:**
- Create: `src/app/admin/layout.tsx` (guard: redirect to `/admin/login` if `!getOwnerSession()`)
- Create: `src/app/admin/login/page.tsx` (magic-link sign-in via Supabase Auth)
- Create: `src/app/admin/page.tsx` (invites: create form + list of recent invites)
- Create: `src/app/admin/submissions/page.tsx` (list from `listSubmissions()`)
- Create: `src/app/admin/submissions/[id]/page.tsx` (detail: all fields + signed download links; delete button)
- Create: `src/app/api/admin/submissions/[id]/route.ts` (`DELETE` → `deleteSubmission`, owner-guarded)
- Create: `src/app/auth/callback/route.ts` (Supabase auth code exchange → set session cookie)

**Interfaces:**
- Consumes: `getOwnerSession`, `listSubmissions`, `getSubmission`, `signDownloadUrl`, `deleteSubmission`, `getServerClient`.
- Produces: the owner admin experience.

**Behaviour spec:**
- `admin/layout.tsx` (server): `if (!(await getOwnerSession())) redirect('/admin/login')` — except allow `/admin/login` itself (put login outside this layout or check pathname). Simplest: `login` lives at `src/app/admin/login/page.tsx` but the guard layout wraps only the other admin pages via a route group `src/app/admin/(protected)/...`. Use a route group so the login page is not guarded.
- `login/page.tsx` (client): email input → `supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${location.origin}/auth/callback` } })`; show "check your email". (Only the owner email will actually be allowed past the guard.)
- `auth/callback/route.ts`: `const supabase = await getServerClient(); await supabase.auth.exchangeCodeForSession(code); redirect('/admin')`.
- `admin/(protected)/page.tsx`: a small form (name, email) → `POST /api/admin/invite` → show the returned link with a "Copy" button; plus a list of recent invites (query via a server action or a `GET` variant) showing status.
- `admin/(protected)/submissions/page.tsx`: table of `listSubmissions()` (name, date, link to detail).
- `admin/(protected)/submissions/[id]/page.tsx` (server): `getSubmission(id)`; render all fields; for each of the three paths call `signDownloadUrl(path)` and render "View / download" links; a client "Delete" button → `DELETE /api/admin/submissions/[id]` → on success redirect to the list.
- `api/admin/submissions/[id]/route.ts`: guard with `getOwnerSession`; `await deleteSubmission(id)`; return `{ ok: true }`.

- [ ] **Step 1: Build `auth/callback/route.ts` + `login/page.tsx`.**
- [ ] **Step 2: Build the protected route group + `layout.tsx` guard.**
- [ ] **Step 3: Build invites page (create + list).**
- [ ] **Step 4: Build submissions list + detail (signed downloads).**
- [ ] **Step 5: Build the delete endpoint + wire the detail page button.**
- [ ] **Step 6: Manual verify** — sign in as the owner email, create an invite, complete a submission via the public form, view + download files, delete the record, confirm files removed from the bucket.
- [ ] **Step 7: Commit**

```bash
git add src/app/admin/ src/app/auth/ src/app/api/admin/submissions/
git commit -m "feat: owner-only admin — auth, invites, submissions, downloads, delete"
```

---

### Task 14: Run all tests + build gate

- [ ] **Step 1: Full test run** — `npm test` → Expected: all PASS.
- [ ] **Step 2: Production build** — `npm run build` → Expected: compiles, all routes present (`/onboarding/[token]`, `/admin/...`, the API routes).
- [ ] **Step 3: Commit any fixes** required to green the build.

---

### Task 15: E2E smoke + docs

**Files:**
- Create: `docs/superpowers/supabase-setup.md`
- (Optional) Create: a Playwright smoke test if a test Supabase project is available.

- [ ] **Step 1: Write `supabase-setup.md`** — step-by-step: create a Supabase project; run `0001_onboarding.sql` in the SQL editor; copy Project URL + anon key + service-role key; add the 5 env vars to Vercel (Production + Preview); add the owner email; enable Email auth provider; set the Site URL + redirect URL to the deployed domain.
- [ ] **Step 2: Manual E2E checklist** — invite → submit (valid + oversized-file rejection + expired-token rejection) → owner view/download → delete; verify a direct (unsigned) file URL returns 403.
- [ ] **Step 3: Commit docs.**

---

## Self-Review

**Spec coverage:** §3 fields → Task 4 schema + Task 2 columns. §4 routes → Tasks 9–13. §4 Supabase/RLS/Storage → Task 2. §4 secrets boundary → Tasks 1, 3, Global Constraints. §5 security (private bucket, RLS, signed URLs, unique/single-use tokens, validation, no-PII) → Tasks 2, 5, 7, 9, 10. §5 consent → Task 4 (`consent: literal(true)`) + Task 7 (`consent_at`). §5 retention/delete → Task 7 `deleteSubmission` + Task 13 delete UI. §6 notify → Task 8. §7 admin → Tasks 11, 13. §8 owner setup/env → Tasks 1, 15. §9 testing → tests in Tasks 1,3,4,5,6,7,8,10,11 + Task 14/15. All covered.

**Placeholder scan:** One deliberate cross-reference — Task 10's test says "copy the `valid` object from Task 4" (and Task 11 similarly). This is to avoid duplicating a 25-field literal three times; the note is explicit and the object is fully defined in Task 4. UI Tasks 12–13 use a behaviour spec rather than full JSX (large, low-risk, follows existing components) — every data flow, endpoint, and state is specified.

**Type consistency:** `getInviteByToken`/`isInviteUsable`/`markInviteUsed` (Task 5) used identically in Tasks 9, 10. `pathBelongsToInvite` (Task 7) used in Task 10. `createSubmission(inviteId, OnboardingSubmission)` (Task 7) matches the Task 4 type. `signDownloadUrl`/`deleteSubmission` (Task 7) used in Task 13. `getOwnerSession` (Task 6) used in Tasks 11, 13. `buildObjectPath` field type `UploadField` (Task 4) matches Task 9. Consistent.
