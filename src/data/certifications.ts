import type { Certification } from '@/types';

export const certifications: Certification[] = [
  {
    id: 'wartsila-certified',
    name: 'Wärtsilä Authorized Service Provider',
    issuer: 'Wärtsilä Corporation',
    description: 'Authorized to perform maintenance, overhaul, and repair services on Wärtsilä dual-fuel engine platforms.',
    image: '/images/certifications/cert-badge-1.svg',
  },
  {
    id: 'iso-9001',
    name: 'ISO 9001:2015 Quality Management',
    issuer: 'International Organization for Standardization',
    description: 'Certified quality management system ensuring consistent, high-quality service delivery across all operations.',
    image: '/images/certifications/cert-badge-2.svg',
  },
  {
    id: 'igem',
    name: 'IGEM Gas Safety Certification',
    issuer: 'Institution of Gas Engineers & Managers',
    description: 'Certified competence in gas safety for LNG fuel systems and associated marine equipment.',
    image: '/images/certifications/cert-badge-1.svg',
  },
  {
    id: 'opito',
    name: 'OPITO Safety Training',
    issuer: 'OPITO International',
    description: 'All field technicians hold OPITO-approved safety certifications for offshore and maritime environments.',
    image: '/images/certifications/cert-badge-2.svg',
  },
  {
    id: 'stcw',
    name: 'STCW Compliance',
    issuer: 'International Maritime Organization',
    description: 'Full compliance with Standards of Training, Certification, and Watchkeeping for Seafarers.',
    image: '/images/certifications/cert-badge-1.svg',
  },
  {
    id: 'iso-45001',
    name: 'ISO 45001 Occupational Health & Safety',
    issuer: 'International Organization for Standardization',
    description: 'Certified occupational health and safety management system for all field operations.',
    image: '/images/certifications/cert-badge-2.svg',
  },
];
