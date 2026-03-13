import Link from 'next/link';
import { Anchor, Phone, Mail, MapPin } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { COMPANY } from '@/lib/constants';

const footerLinks = {
  expertise: [
    { label: 'Our Capabilities', href: '/expertise/capabilities' },
    { label: 'Technical Expertise', href: '/expertise/technical' },
    { label: 'Certifications', href: '/expertise/certifications' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Case Studies', href: '/case-studies' },
    { label: 'Contact', href: '/contact' },
  ],
  services: [
    { label: 'Planned Maintenance', href: '/services#planned-maintenance' },
    { label: 'Engine Overhauls', href: '/services#major-maintenance' },
    { label: 'LNG Fuel Systems', href: '/services#lng-support' },
    { label: '24/7 Emergency', href: '/services#emergency-service' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-navy-900 text-navy-300">
      <Container>
        <div className="grid grid-cols-1 gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-3 mb-6">
              <Anchor className="h-8 w-8 text-orange-500" />
              <div>
                <span className="font-sans text-xl font-bold text-white">AKIRA</span>
                <span className="block font-sans text-xs text-navy-400 tracking-widest uppercase">Marine Services</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed mb-6">
              Specialized field service maintenance for Wärtsilä dual-fuel 4-stroke engines. Your trusted partner for LNG-powered vessel operations.
            </p>
            <div className="space-y-3">
              <a href={`tel:${COMPANY.phone}`} className="flex items-center gap-3 text-sm hover:text-orange-400 transition-colors">
                <Phone className="h-4 w-4 text-orange-500" />
                {COMPANY.phone}
              </a>
              <a href={`mailto:${COMPANY.email}`} className="flex items-center gap-3 text-sm hover:text-orange-400 transition-colors">
                <Mail className="h-4 w-4 text-orange-500" />
                {COMPANY.email}
              </a>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-orange-500 shrink-0" />
                {COMPANY.address.city}, {COMPANY.address.state}, {COMPANY.address.country}
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-sans text-sm font-semibold text-white uppercase tracking-wider mb-6">Dual-Fuel Specialists</h3>
            <ul className="space-y-3">
              {footerLinks.expertise.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-orange-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-sans text-sm font-semibold text-white uppercase tracking-wider mb-6">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-orange-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-sans text-sm font-semibold text-white uppercase tracking-wider mb-6">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-orange-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-navy-800 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-navy-500">
            &copy; {new Date().getFullYear()} {COMPANY.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-navy-500">
            <Link href="#" className="hover:text-navy-300 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-navy-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
