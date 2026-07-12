'use client';

import { useState } from 'react';
import { Copy, Check, Send } from 'lucide-react';

type ResendState = 'idle' | 'sending' | 'sent' | 'error';

interface InviteRowActionsProps {
  id: string;
  url: string;
  usable: boolean;
}

export function InviteRowActions({ id, url, usable }: InviteRowActionsProps) {
  const [copied, setCopied] = useState(false);
  const [resend, setResend] = useState<ResendState>('idle');

  // Only usable invites (pending, unused, not time-expired) have a live link
  // and can be re-sent. `usable` is computed server-side via isInviteUsable.
  if (!usable) {
    return <span className="text-[var(--color-ink-100)]">—</span>;
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleResend() {
    setResend('sending');
    try {
      const res = await fetch('/api/admin/invite/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setResend(res.ok ? 'sent' : 'error');
    } catch {
      setResend('error');
    }
    setTimeout(() => setResend('idle'), 2500);
  }

  const resendLabel =
    resend === 'sending' ? 'Sending…' : resend === 'sent' ? 'Sent' : resend === 'error' ? 'Failed' : 'Resend';

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 font-sans font-medium text-[var(--color-signal-400)] transition-colors hover:text-[var(--color-ink-400)] focus:outline-none focus:ring-2 focus:ring-[var(--color-signal-400)] focus:ring-offset-2"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? 'Copied' : 'Copy'}
      </button>
      <button
        type="button"
        onClick={handleResend}
        disabled={resend === 'sending'}
        className="inline-flex items-center gap-1.5 font-sans font-medium text-[var(--color-signal-400)] transition-colors hover:text-[var(--color-ink-400)] focus:outline-none focus:ring-2 focus:ring-[var(--color-signal-400)] focus:ring-offset-2 disabled:opacity-50"
      >
        <Send className="h-3.5 w-3.5" />
        {resendLabel}
      </button>
    </div>
  );
}
