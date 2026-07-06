import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-white">
      <Container>
        <div className="text-center">
          <h1 className="text-8xl font-bold text-navy-900 uppercase mb-4">404</h1>
          <h2 className="text-2xl font-bold text-navy-600 uppercase mb-6">Page Not Found</h2>
          <p className="text-navy-500 mb-10 max-w-md mx-auto">
            The page you&apos;re looking for seems to have drifted off course.
            Let&apos;s get you back on track.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/" variant="primary">Back to Home</Button>
            <Button href="/contact" variant="outline">Contact Support</Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
