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

// Sent TO the joiner when the owner creates (or resends) an invite. The URL is
// built from a url-safe nanoid token on our own origin, so it is safe in href;
// the owner-supplied name is HTML-escaped.
export function buildInviteEmail(input: { name: string; url: string }) {
  const safeName = sanitize(input.name);
  return {
    subject: 'Complete your onboarding — Akira Marine Solutions',
    html: `<div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:0 auto;color:#1f1b17;line-height:1.6;">
  <p style="font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#b23a2e;margin:0 0 8px;">Akira Marine Solutions</p>
  <h1 style="font-size:22px;margin:0 0 16px;">Welcome aboard, ${safeName}</h1>
  <p style="margin:0 0 16px;">You have been invited to complete your onboarding with Akira Marine Solutions. It takes a few minutes: you will enter your personal and passport details and upload a photo and your passport pages.</p>
  <p style="margin:0 0 24px;"><a href="${input.url}" style="display:inline-block;background:#b23a2e;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:6px;font-weight:bold;">Start onboarding</a></p>
  <p style="margin:0 0 8px;font-size:14px;color:#6b6357;">This link is personal to you, can be used once, and expires in 14 days.</p>
  <p style="margin:0 0 24px;font-size:14px;color:#6b6357;">If the button does not work, copy and paste this link:<br><span style="word-break:break-all;">${input.url}</span></p>
  <p style="margin:0;font-size:14px;color:#6b6357;">If you were not expecting this, you can ignore this email.</p>
</div>`,
  };
}

export async function sendInviteEmail(input: { name: string; email: string; url: string }) {
  const { subject, html } = buildInviteEmail({ name: input.name, url: input.url });
  const resend = new Resend(env.resendApiKey);
  const { error } = await resend.emails.send({
    from: 'Akira Onboarding <onboarding@akiramarinesolutions.com>',
    to: input.email, subject, html,
  });
  if (error) throw new Error(`sendInviteEmail failed: ${error.message}`);
}
