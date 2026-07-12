import { nanoid } from 'nanoid';
import type { UploadField } from './schema';

const ALLOWED_EXT = new Set(['jpg', 'jpeg', 'png', 'heic', 'pdf']);

export function buildObjectPath(inviteId: string, field: UploadField, filename: string): string {
  const raw = (filename.split('.').pop() ?? '').toLowerCase();
  const ext = ALLOWED_EXT.has(raw) ? (raw === 'jpeg' ? 'jpg' : raw) : 'bin';
  return `onboarding/${inviteId}/${field}-${nanoid(10)}.${ext}`;
}
