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

export async function createInvite(input: { name: string; email: string; ttlDays?: number }): Promise<{ id: string; token: string; url: string }> {
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
  const { data, error } = await db.from('invites').select('*').eq('token', token).maybeSingle();
  if (error) throw new Error(`getInviteByToken failed: ${error.message}`);
  return (data as InviteRow) ?? null;
}

export async function markInviteUsed(id: string): Promise<void> {
  const db = getAdminClient();
  const { error } = await db.from('invites')
    .update({ status: 'used', used_at: new Date().toISOString() })
    .eq('id', id).eq('status', 'pending');
  if (error) throw new Error(`markInviteUsed failed: ${error.message}`);
}
