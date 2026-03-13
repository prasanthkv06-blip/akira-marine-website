import { NextRequest, NextResponse } from 'next/server';
import { contactFormSchema } from '@/lib/validation';
import { checkRateLimit } from '@/lib/rate-limiter';
import { sanitize } from '@/lib/sanitize';

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

    // In production, send email here using Resend, Nodemailer, etc.
    // For now, log the submission
    console.log('Contact form submission:', sanitized);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
