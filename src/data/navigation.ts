import type { NavItem } from '@/types';

export const navigation: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  {
    label: 'Dual-Fuel Specialists',
    href: '/expertise',
    children: [
      { label: 'Overview', href: '/expertise' },
      { label: 'Our Capabilities', href: '/expertise/capabilities' },
      { label: 'Technical Expertise', href: '/expertise/technical' },
      { label: 'Certifications & Training', href: '/expertise/certifications' },
    ],
  },
  { label: 'Services', href: '/services' },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'Contact', href: '/contact' },
];
