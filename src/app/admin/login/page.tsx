'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/forms/FormField';
import { FormStatus } from '@/components/forms/FormStatus';

// ponytail: NEXT_PUBLIC_* must be referenced as a literal `process.env.X` for
// Next to inline it into the client bundle — env.ts's dynamic lookup won't work here.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState<string | undefined>();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setMessage('Sending magic link…');
    try {
      const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${location.origin}/auth/callback` },
      });
      if (error) {
        setStatus('error');
        setMessage(error.message);
        return;
      }
      setStatus('success');
      setMessage('Check your email for a sign-in link.');
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  }

  return (
    <section className="pt-36 pb-24 sm:pb-32 bg-white min-h-[70vh] flex items-center">
      <Container>
        <div className="mx-auto max-w-md">
          <span className="eyebrow block text-[var(--color-signal-400)]">Admin</span>
          <h1 className="mt-6 text-[clamp(1.75rem,3vw,2.5rem)] font-extrabold leading-[1.05] tracking-[-0.025em] text-[var(--color-ink-400)]">
            Sign in
          </h1>
          <p className="mt-4 text-[var(--color-ink-100)] leading-relaxed">
            Enter the owner email to receive a magic sign-in link.
          </p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-6" noValidate>
            <FormField label="Email" name="email" type="email" required value={email} onChange={setEmail} />
            <FormStatus status={status} message={message} />
            <Button type="submit" variant="primary" size="lg" disabled={status === 'loading'} className="w-full">
              {status === 'loading' ? 'Sending…' : 'Send magic link'}
            </Button>
          </form>
        </div>
      </Container>
    </section>
  );
}
