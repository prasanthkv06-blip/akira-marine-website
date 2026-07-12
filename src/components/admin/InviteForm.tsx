'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Copy, Check } from 'lucide-react';
import { FormField } from '@/components/forms/FormField';
import { FormStatus } from '@/components/forms/FormStatus';
import { Button } from '@/components/ui/Button';

type Status = 'idle' | 'loading' | 'success' | 'error';

export function InviteForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState<string | undefined>();
  const [url, setUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setMessage('Creating invite…');
    setUrl(null);
    setCopied(false);
    try {
      const res = await fetch('/api/admin/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        setStatus('error');
        setMessage(body?.error ?? 'Failed to create invite.');
        return;
      }
      const sentTo = email;
      setUrl(body.url as string);
      setStatus('success');
      setMessage(
        body?.emailed
          ? `Invite created and emailed to ${sentTo}.`
          : 'Invite created, but the email could not be sent. Copy the link below and send it manually.',
      );
      setName('');
      setEmail('');
      router.refresh();
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  }

  async function handleCopy() {
    if (!url) return;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div>
      <h2 className="eyebrow mb-6 text-[var(--color-signal-400)]">New invite</h2>
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <FormField label="Name" name="name" required value={name} onChange={setName} />
        <FormField label="Email" name="email" type="email" required value={email} onChange={setEmail} />
        <FormStatus status={status} message={message} />
        <Button type="submit" variant="primary" disabled={status === 'loading'} className="w-full">
          {status === 'loading' ? 'Creating…' : 'Create invite'}
        </Button>
      </form>

      {url && (
        <div className="mt-6 rounded-lg border border-[rgba(31,27,23,0.12)] bg-[var(--color-paper-50)] p-4">
          <p className="break-all font-mono text-sm text-[var(--color-ink-200)]">{url}</p>
          <button
            type="button"
            onClick={handleCopy}
            className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-signal-400)] transition-colors hover:text-[var(--color-ink-400)] focus:outline-none focus:ring-2 focus:ring-[var(--color-signal-400)] focus:ring-offset-2"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied' : 'Copy link'}
          </button>
        </div>
      )}
    </div>
  );
}
