import type { Certification } from '@/types';

// Standards and competencies our field service is built around — framed as the
// benchmarks our work aligns to, not as certificates the company currently holds.
export const certifications: Certification[] = [
  {
    id: 'iso-9001',
    name: 'ISO 9001:2015 Quality Management',
    issuer: 'International Organization for Standardization',
    description:
      'Our quality-management approach follows ISO 9001:2015 principles for consistent, documented, and repeatable service delivery.',
    image: '/images/certifications/cert-badge-2.svg',
  },
  {
    id: 'igem',
    name: 'IGEM Gas Safety Standards',
    issuer: 'Institution of Gas Engineers & Managers',
    description:
      'Work on LNG fuel systems follows IGEM gas-safety standards and competence guidelines.',
    image: '/images/certifications/cert-badge-1.svg',
  },
  {
    id: 'opito',
    name: 'OPITO Safety Training',
    issuer: 'OPITO International',
    description:
      'Field technicians are trained to OPITO-approved safety standards for offshore and maritime environments.',
    image: '/images/certifications/cert-badge-2.svg',
  },
  {
    id: 'stcw',
    name: 'STCW Standards',
    issuer: 'International Maritime Organization',
    description:
      'Our practices align with the IMO STCW framework for the training, certification, and watchkeeping of seafarers.',
    image: '/images/certifications/cert-badge-1.svg',
  },
  {
    id: 'iso-45001',
    name: 'ISO 45001 Occupational Health & Safety',
    issuer: 'International Organization for Standardization',
    description:
      'Field operations follow ISO 45001 occupational health and safety management principles.',
    image: '/images/certifications/cert-badge-2.svg',
  },
];
