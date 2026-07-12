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
