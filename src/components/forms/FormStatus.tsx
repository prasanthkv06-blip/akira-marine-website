import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface FormStatusProps {
  status: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
}

export function FormStatus({ status, message }: FormStatusProps) {
  if (status === 'idle') return null;

  return (
    <div className={`rounded-lg p-4 flex items-start gap-3 ${
      status === 'loading' ? 'bg-[var(--color-paper-50)] text-[var(--color-ink-200)]' :
      status === 'success' ? 'bg-green-50 text-green-800' :
      'bg-red-50 text-red-800'
    }`}>
      {status === 'loading' && <Loader2 className="h-5 w-5 animate-spin flex-shrink-0 mt-0.5" />}
      {status === 'success' && <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />}
      {status === 'error' && <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />}
      <p className="text-sm font-sans">
        {message || (
          status === 'loading' ? 'Sending your message...' :
          status === 'success' ? 'Thank you! Your message has been sent successfully. We\'ll get back to you shortly.' :
          'Something went wrong. Please try again or contact us directly.'
        )}
      </p>
    </div>
  );
}
