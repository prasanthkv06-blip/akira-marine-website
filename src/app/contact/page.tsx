import type { Metadata } from 'next';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { FadeIn } from '@/components/animations/FadeIn';
import { ContactForm } from '@/components/forms/ContactForm';
import { COMPANY } from '@/lib/constants';
import { createMetadata } from '@/lib/metadata';

export const metadata: Metadata = createMetadata({
  title: 'Contact Us',
  description: 'Get in touch with Akira Marine Services for Wärtsilä dual-fuel engine maintenance, emergency support, or service inquiries.',
  path: '/contact',
});

const contactInfo = [
  { icon: Phone, label: 'Phone', value: COMPANY.phone, href: `tel:${COMPANY.phone}` },
  { icon: Mail, label: 'Email', value: COMPANY.email, href: `mailto:${COMPANY.email}` },
  { icon: MapPin, label: 'Location', value: `${COMPANY.address.city}, ${COMPANY.address.state}, ${COMPANY.address.country}` },
  { icon: Clock, label: 'Emergency', value: '24/7 Available', href: `tel:${COMPANY.phone}` },
];

export default function ContactPage() {
  return (
    <>
      <section className="pt-32 pb-16 bg-gradient-to-br from-navy-900 to-navy-800">
        <Container>
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Contact', href: '/contact' }]} />
          <FadeIn>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mt-4">Get In Touch</h1>
            <p className="mt-4 text-xl text-navy-300 max-w-2xl">
              Ready to discuss your Wärtsilä engine maintenance needs? Our team is here to help.
            </p>
          </FadeIn>
        </Container>
      </section>

      <section className="py-24 bg-white">
        <Container>
          <div className="grid gap-16 lg:grid-cols-5">
            {/* Form */}
            <div className="lg:col-span-3">
              <FadeIn>
                <h2 className="text-2xl font-sans font-bold text-navy-900 mb-8">Send Us a Message</h2>
                <ContactForm />
              </FadeIn>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-2">
              <FadeIn delay={0.2}>
                <div className="rounded-xl bg-navy-50 p-8 lg:p-10">
                  <h2 className="text-2xl font-sans font-bold text-navy-900 mb-8">Contact Information</h2>
                  <div className="space-y-6">
                    {contactInfo.map(({ icon: Icon, label, value, href }) => (
                      <div key={label} className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm font-sans font-medium text-navy-500">{label}</p>
                          {href ? (
                            <a href={href} className="text-navy-900 font-medium hover:text-orange-600 transition-colors">
                              {value}
                            </a>
                          ) : (
                            <p className="text-navy-900 font-medium">{value}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Map placeholder */}
                  <div className="mt-8 rounded-lg bg-navy-200 aspect-[4/3] flex items-center justify-center">
                    <div className="text-center text-navy-500">
                      <MapPin className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm font-sans">Map will be integrated here</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
