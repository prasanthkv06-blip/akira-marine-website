'use client';

import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="min-h-screen flex items-center justify-center bg-navy-900">
      <Container>
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-orange-500 mx-auto mb-6" />
          <h1 className="text-4xl font-sans font-bold text-white mb-4">Something Went Wrong</h1>
          <p className="text-navy-400 mb-10 max-w-md mx-auto">
            An unexpected error occurred. Please try again or contact our support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={reset} variant="primary">Try Again</Button>
            <Button href="/" variant="outline" className="border-navy-600 text-navy-300 hover:bg-navy-800 hover:text-white">Back to Home</Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
