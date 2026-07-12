import { Resend } from 'resend';
import { env } from '@/lib/env';
import { sanitize } from '@/lib/sanitize';

export function buildNotificationEmail(input: { name: string; submissionId: string }) {
  const url = `${env.appUrl}/admin/submissions/${input.submissionId}`;
  return {
    subject: `New onboarding submission — ${input.name}`,
    html: `<p>A new joiner has submitted their onboarding details.</p>
<p><strong>${sanitize(input.name)}</strong></p>
<p>Review it in the admin area: <a href="${url}">${url}</a></p>`,
  };
}

export async function sendSubmissionNotification(input: { name: string; submissionId: string }) {
  const { subject, html } = buildNotificationEmail(input);
  const resend = new Resend(env.resendApiKey);
  const { error } = await resend.emails.send({
    from: 'Akira Onboarding <onboarding@akiramarinesolutions.com>',
    to: env.adminOwnerEmail, subject, html,
  });
  if (error) throw new Error(`sendSubmissionNotification failed: ${error.message}`);
}
