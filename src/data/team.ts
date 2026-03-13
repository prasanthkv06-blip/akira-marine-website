import type { TeamMember } from '@/types';

export const team: TeamMember[] = [
  {
    id: 'captain-singh',
    name: 'Capt. Rajesh Singh',
    role: 'Founder & Managing Director',
    bio: 'Over 25 years of maritime experience with extensive knowledge of LNG carrier operations and dual-fuel propulsion systems. Former Chief Engineer with deep expertise in Wärtsilä engine platforms.',
    yearsExperience: 25,
    image: '/images/placeholder-portrait.jpg',
    certifications: ['Master Mariner', 'Wärtsilä Certified', 'IGEM Certified'],
  },
  {
    id: 'kumar-patel',
    name: 'Kumar Patel',
    role: 'Head of Technical Operations',
    bio: 'Specialized in Wärtsilä 34DF and 46DF engine platforms with 18 years of field service experience across major global ports. Expert in UNIGEN control systems and LNG fuel handling.',
    yearsExperience: 18,
    image: '/images/placeholder-portrait.jpg',
    certifications: ['Wärtsilä 34DF/46DF Specialist', 'OPITO Certified', 'LNG Safety'],
  },
  {
    id: 'anand-sharma',
    name: 'Anand Sharma',
    role: 'Senior Field Engineer',
    bio: 'Expert diagnostic technician specializing in dual-fuel combustion dynamics and electronic control systems. Has led over 200 successful engine overhauls across LNG carriers and FSRU vessels.',
    yearsExperience: 15,
    image: '/images/placeholder-portrait.jpg',
    certifications: ['Wärtsilä 31DF Specialist', 'Gas Turbine Engineer', 'STCW Certified'],
  },
  {
    id: 'priya-nair',
    name: 'Priya Nair',
    role: 'Quality & Safety Manager',
    bio: 'Ensures all field operations meet the highest safety and quality standards. Certified in ISM Code auditing with deep knowledge of SOLAS and classification society requirements.',
    yearsExperience: 12,
    image: '/images/placeholder-portrait.jpg',
    certifications: ['ISM Lead Auditor', 'NEBOSH IGC', 'ISO 45001 Auditor'],
  },
];
