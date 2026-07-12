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
