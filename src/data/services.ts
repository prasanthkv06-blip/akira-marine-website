import type { Service } from '@/types';

export const services: Service[] = [
  {
    id: 'planned-maintenance',
    title: 'Planned Maintenance',
    shortDescription: 'Scheduled field service adhering to OEM guidelines for warranty compliance and peak performance.',
    fullDescription: 'Scheduled field service adhering to stringent OEM guidelines, ensuring warranty compliance and peak performance in both gas and fuel-oil modes. Our maintenance programs are designed to maximize engine reliability while minimizing operational disruptions.',
    icon: 'wrench',
    image: '/images/services/field-service.jpg',
    features: [
      'Adherence to OEM maintenance schedules',
      'Warranty compliance assurance',
      'Gas and fuel-oil mode optimization',
      'Detailed service documentation',
      'Performance trend analysis',
    ],
  },
  {
    id: 'major-maintenance',
    title: 'On-Site Major Maintenance',
    shortDescription: 'Complete engine overhauls from cylinder head replacements to full rebuilds without dry-docking.',
    fullDescription: 'From cylinder head replacements to complete engine overhauls, our mobile workshops are equipped to handle complex tasks without dry-docking. We bring the workshop to your vessel, performing precision overhauls that would traditionally require extended port stays.',
    icon: 'cog',
    image: '/images/services/engine-overhaul.jpg',
    features: [
      'Cylinder head overhaul and reconditioning',
      'Top-end and major engine overhauls',
      'Turbocharger maintenance and balancing',
      'Crankshaft inspection and measurement',
      'Mobile workshop deployment',
    ],
  },
  {
    id: 'lng-support',
    title: 'LNG Fuel System Support',
    shortDescription: 'Expert maintenance of gas valve units, safety systems, and fuel handling components.',
    fullDescription: 'Expertise in the components surrounding the engine, including gas valve units and safety systems, ensuring a holistic approach to your propulsion plant. Our LNG specialists understand the unique challenges of dual-fuel operations.',
    icon: 'flame',
    image: '/images/services/lng-system.jpg',
    features: [
      'Gas valve unit maintenance',
      'LNG fuel handling system servicing',
      'Safety system inspection and testing',
      'Fuel gas supply system support',
      'Boil-off gas management systems',
    ],
  },
  {
    id: 'emergency-service',
    title: '24/7 Emergency Field Service',
    shortDescription: 'Rapid mobilization to critical ports worldwide to resolve unexpected engine issues.',
    fullDescription: 'Rapid mobilization of technicians to critical ports to resolve unexpected issues and minimize costly downtime. Our emergency response team is available around the clock, ready to deploy to any port worldwide.',
    icon: 'siren',
    image: '/images/services/emergency.jpg',
    features: [
      '24/7 emergency hotline',
      'Global port coverage',
      'Rapid technician deployment',
      'Spare parts logistics coordination',
      'Root cause analysis and reporting',
    ],
  },
];
