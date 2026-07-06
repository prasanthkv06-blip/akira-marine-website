'use client';

import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="min-h-screen flex items-center justify-center bg-white">
      <Container>
        <div className="text-center">
          <h1 className="text-6xl font-bold text-navy-900 uppercase mb-4">Error</h1>
          <p className="text-navy-500 mb-10 max-w-md mx-auto">
            An unexpected error occurred. Please try again or contact our support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={reset} variant="primary">Try Again</Button>
            <Button href="/" variant="outline">Back to Home</Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
