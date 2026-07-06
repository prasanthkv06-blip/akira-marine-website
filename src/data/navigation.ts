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
    ],
  },
  { label: 'Services', href: '/services' },
  { label: 'Contact', href: '/contact' },
];
