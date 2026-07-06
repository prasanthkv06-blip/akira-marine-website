'use client';

import { useState } from 'react';
import { FormField } from './FormField';
import { FormStatus } from './FormStatus';
import { Button } from '@/components/ui/Button';
import { contactFormSchema } from '@/lib/validation';

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
  honeypot: string;
}

const initialForm: FormData = {
  name: '',
  email: '',
  phone: '',
  company: '',
  service: '',
  message: '',
  honeypot: '',
};

const serviceOptions = [
  'Planned Maintenance',
  'Engine Overhaul',
  'LNG Fuel System Support',
  '24/7 Emergency Service',
  'Troubleshooting & Diagnostics',
  'Other',
];

export function ContactForm() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const updateField = (field: keyof FormData) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = contactFormSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof FormData, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof FormData;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus('success');
        setForm(initialForm);
      } else {
        const data = await res.json();
        setStatus('error');
        if (data.errors) {
          setErrors(data.errors);
        }
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Honeypot */}
      <div className="absolute opacity-0 pointer-events-none h-0 overflow-hidden" aria-hidden="true">
        <input
          type="text"
          name="honeypot"
          tabIndex={-1}
          autoComplete="off"
          value={form.honeypot}
          onChange={(e) => updateField('honeypot')(e.target.value)}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField
          label="Full Name"
          name="name"
          placeholder="Your full name"
          required
          error={errors.name}
          value={form.name}
          onChange={updateField('name')}
        />
        <FormField
          label="Email Address"
          name="email"
          type="email"
          placeholder="your@email.com"
          required
          error={errors.email}
          value={form.email}
          onChange={updateField('email')}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField
          label="Phone Number"
          name="phone"
          type="tel"
          placeholder="+1 (555) 000-0000"
          error={errors.phone}
          value={form.phone}
          onChange={updateField('phone')}
        />
        <FormField
          label="Company"
          name="company"
          placeholder="Your company name"
          error={errors.company}
          value={form.company}
          onChange={updateField('company')}
        />
      </div>

      <div>
        <label htmlFor="service" className="block text-sm font-sans font-medium text-[var(--color-ink-300)] mb-2">
          Service Interest
        </label>
        <select
          id="service"
          name="service"
          value={form.service}
          onChange={(e) => updateField('service')(e.target.value)}
          className="w-full rounded-lg border border-[rgba(31,27,23,0.12)] bg-white px-4 py-3 font-serif text-[var(--color-ink-400)] focus:outline-none focus:ring-2 focus:ring-[var(--color-signal-400)] focus:border-transparent hover:border-[rgba(31,27,23,0.20)] transition-colors"
        >
          <option value="">Select a service...</option>
          {serviceOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <FormField
        label="Message"
        name="message"
        type="textarea"
        placeholder="Tell us about your project or requirements..."
        required
        error={errors.message}
        value={form.message}
        onChange={updateField('message')}
      />

      <FormStatus status={status} />

      <Button type="submit" variant="primary" size="lg" disabled={status === 'loading'} className="w-full sm:w-auto">
        {status === 'loading' ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  );
}
