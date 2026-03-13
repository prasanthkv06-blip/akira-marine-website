import type { CaseStudy } from '@/types';

export const caseStudies: CaseStudy[] = [
  {
    slug: 'emergency-overhaul-singapore',
    title: 'Emergency Cylinder Head Replacement in Singapore',
    summary: 'Rapid mobilization and successful completion of an emergency cylinder head replacement on a Wärtsilä 46DF engine, restoring full dual-fuel capability within 72 hours.',
    challenge: 'A 174,000 m³ LNG carrier experienced a cylinder head failure on its Wärtsilä 12V46DF main engine while approaching Singapore. The vessel needed to be operational within 72 hours to meet its charter commitments.',
    solution: 'Our team mobilized within 6 hours, arriving with specialist tooling and a reconditioned cylinder head. Working in coordinated shifts, we completed the replacement, performed all necessary calibrations, and conducted comprehensive gas and diesel mode testing.',
    result: 'The vessel departed on schedule with full dual-fuel capability restored. The rapid response saved the operator an estimated $850,000 in off-hire costs and charter penalties.',
    image: '/images/case-study-1.jpg',
    tags: ['Emergency Response', 'Wärtsilä 46DF', 'LNG Carrier'],
    date: '2025-08',
  },
  {
    slug: 'planned-overhaul-rotterdam',
    title: 'Major Overhaul Program for LNG Fleet in Rotterdam',
    summary: 'Executed a coordinated major maintenance program across three LNG carriers during their scheduled port calls in Rotterdam, completing all work within tight turnaround windows.',
    challenge: 'A major LNG shipping operator required major overhauls on Wärtsilä 34DF engines across three vessels, with each vessel available for only 5 days during scheduled port calls over a 6-week period.',
    solution: 'We developed a detailed project plan with pre-staged equipment and spare parts at the Rotterdam terminal. Each vessel received a dedicated team of 8 engineers who executed the overhaul program using our mobile workshop facilities.',
    result: 'All three vessels completed their major overhauls within the scheduled windows, with zero delays to subsequent voyages. Engine performance data showed a 12% improvement in fuel efficiency post-overhaul.',
    image: '/images/case-study-2.jpg',
    tags: ['Planned Maintenance', 'Wärtsilä 34DF', 'Fleet Program'],
    date: '2025-05',
  },
  {
    slug: 'lng-system-upgrade-qatar',
    title: 'LNG Fuel System Optimization in Ras Laffan',
    summary: 'Successfully upgraded the LNG fuel gas supply system on a Q-Max carrier, improving gas mode reliability by 30% and reducing methane slip.',
    challenge: 'A Q-Max LNG carrier was experiencing intermittent gas mode trip-outs on its Wärtsilä 50DF engines, forcing frequent fallback to diesel mode and increasing fuel costs significantly.',
    solution: 'Our diagnostic team identified calibration drift in the gas valve units and outdated control software. We performed complete GVU reconditioning, updated the UNIGEN control parameters, and conducted extensive sea trial simulations in port.',
    result: 'Gas mode reliability improved from 85% to 98.5%. The operator reported a 22% reduction in fuel costs over the following quarter, with zero unplanned gas mode trip-outs.',
    image: '/images/case-study-3.jpg',
    tags: ['LNG Systems', 'Diagnostics', 'FSRU'],
    date: '2025-02',
  },
];
