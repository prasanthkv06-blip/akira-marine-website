import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Anchor } from 'lucide-react';

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-navy-900">
      <Container>
        <div className="text-center">
          <Anchor className="h-16 w-16 text-orange-500 mx-auto mb-6" />
          <h1 className="text-6xl font-sans font-bold text-white mb-4">404</h1>
          <h2 className="text-2xl font-sans font-semibold text-navy-300 mb-6">Page Not Found</h2>
          <p className="text-navy-400 mb-10 max-w-md mx-auto">
            The page you&apos;re looking for seems to have drifted off course.
            Let&apos;s get you back on track.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/" variant="primary">Back to Home</Button>
            <Button href="/contact" variant="outline" className="border-navy-600 text-navy-300 hover:bg-navy-800 hover:text-white">Contact Support</Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
