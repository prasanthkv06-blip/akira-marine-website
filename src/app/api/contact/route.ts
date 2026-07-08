import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { contactFormSchema } from '@/lib/validation';
import { checkRateLimit } from '@/lib/rate-limiter';
import { sanitize } from '@/lib/sanitize';

const getResend = () => {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
};

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const rateCheck = checkRateLimit(ip);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.', retryAfter: rateCheck.retryAfter },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();

    // Validate
    const result = contactFormSchema.safeParse(body);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        errors[field] = issue.message;
      });
      return NextResponse.json({ error: 'Validation failed', errors }, { status: 400 });
    }

    // Check honeypot
    if (result.data.honeypot) {
      // Silently accept but don't process (bot detected)
      return NextResponse.json({ success: true });
    }

    // Sanitize inputs
    const sanitized = {
      name: sanitize(result.data.name),
      email: sanitize(result.data.email),
      phone: result.data.phone ? sanitize(result.data.phone) : '',
      company: result.data.company ? sanitize(result.data.company) : '',
      service: result.data.service ? sanitize(result.data.service) : '',
      message: sanitize(result.data.message),
    };

    // Send email via Resend
    const resend = getResend();
    if (resend) {
      await resend.emails.send({
        from: 'AKIRA Website <noreply@akiramarinesolutions.com>',
        to: ['info@akiramarinesolutions.com', 'prasanthkv06@gmail.com'],
        replyTo: sanitized.email,
        subject: `New enquiry from ${sanitized.name}${sanitized.company ? ` — ${sanitized.company}` : ''}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${sanitized.name}</p>
          <p><strong>Email:</strong> ${sanitized.email}</p>
          ${sanitized.phone ? `<p><strong>Phone:</strong> ${sanitized.phone}</p>` : ''}
          ${sanitized.company ? `<p><strong>Company:</strong> ${sanitized.company}</p>` : ''}
          ${sanitized.service ? `<p><strong>Service:</strong> ${sanitized.service}</p>` : ''}
          <p><strong>Message:</strong></p>
          <p>${sanitized.message.replace(/\n/g, '<br>')}</p>
        `,
      });
    } else {
      console.warn('[contact] RESEND_API_KEY not configured — submission accepted but email not sent');
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
