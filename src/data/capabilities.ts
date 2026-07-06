import type { Capability } from '@/types';

export const capabilities: Capability[] = [
  {
    id: 'field-service',
    title: 'Field Service & Maintenance',
    description: 'Our onboard workshop approach brings the full capability of a dedicated service facility directly to your vessel. For dual-fuel 4-stroke marine engines, this means reduced vessel downtime, no dry-docking requirements, and maintenance performed by specialists who understand the unique demands of LNG-powered operations.',
    icon: 'wrench',
    features: [
      'Mobile workshop deployment to any global port',
      'Scheduled maintenance per OEM guidelines',
      'Warranty-compliant service procedures',
      'Real-time performance monitoring',
      'Comprehensive service documentation',
    ],
  },
  {
    id: 'engine-overhauls',
    title: 'Engine Overhauls',
    description: 'From top-end overhauls to complete major rebuilds, our process follows OEM-grade standards. Each overhaul includes comprehensive inspection, precision measurement, component reconditioning, and full operational testing in both gas and diesel modes.',
    icon: 'cog',
    features: [
      'Top-end overhauls (cylinder heads, liners, pistons)',
      'Major overhauls (crankshaft, bearings, running gear)',
      'Component reconditioning and certification',
      'Precision measurement and alignment',
      'Post-overhaul performance verification',
    ],
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting & Repairs',
    description: 'Our diagnostic capabilities span both gas and diesel operating modes. Using manufacturer-approved diagnostic tools and our extensive field experience, we identify root causes quickly and implement lasting solutions.',
    icon: 'search',
    features: [
      'Advanced engine diagnostic analysis',
      'Gas mode fault diagnosis',
      'Diesel mode performance troubleshooting',
      'Control system parameter analysis',
      'Vibration and thermal analysis',
    ],
  },
  {
    id: 'retrofits',
    title: 'Retrofits & Upgrades',
    description: 'Stay current with dual-fuel technology updates and regulatory requirements. We implement manufacturer-approved retrofits and upgrades to enhance engine performance, reliability, and environmental compliance.',
    icon: 'arrow-up-circle',
    features: [
      'OEM-approved modifications',
      'Control system software updates',
      'Emission compliance upgrades',
      'Performance enhancement packages',
      'Safety system modernization',
    ],
  },
];
