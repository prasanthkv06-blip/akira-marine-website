import type { EngineModel } from '@/types';

// Trademark-free platform descriptions. Categorised by bore size / power class
// rather than by OEM model designation.
export const engineModels: EngineModel[] = [
  {
    id: 'mid-df',
    name: 'Mid-bore Dual-Fuel',
    type: '4-stroke, dual-fuel (~32 cm bore)',
    cylinders: '6L, 8V, 9L, 12V, 16V, 18V',
    power: '3,480 – 9,720 kW',
    speed: '720 / 750 rpm',
    fuelModes: ['Natural Gas (LNG)', 'Marine Diesel Oil (MDO)', 'Heavy Fuel Oil (HFO)'],
    description: 'A versatile and reliable dual-fuel platform widely deployed on LNG carriers, offshore vessels, and cruise ships. Balanced power density with seamless fuel switching and low emissions.',
  },
  {
    id: 'large-df',
    name: 'Large-bore Dual-Fuel',
    type: '4-stroke, dual-fuel (~46 cm bore)',
    cylinders: '6L, 8L, 9L, 12V, 14V, 16V',
    power: '5,700 – 15,200 kW',
    speed: '500 / 514 rpm',
    fuelModes: ['Natural Gas (LNG)', 'Marine Diesel Oil (MDO)', 'Heavy Fuel Oil (HFO)'],
    description: 'A flagship-class dual-fuel platform for large LNG carriers and power generation duty. High output combined with strong fuel flexibility and environmental performance.',
  },
  {
    id: 'heavy-df',
    name: 'Heavy Dual-Fuel',
    type: '4-stroke, dual-fuel (~50 cm bore)',
    cylinders: '6L, 8L, 9L, 12V, 16V, 18V',
    power: '5,700 – 17,550 kW',
    speed: '500 / 514 rpm',
    fuelModes: ['Natural Gas (LNG)', 'Marine Diesel Oil (MDO)', 'Heavy Fuel Oil (HFO)'],
    description: 'The largest and most powerful 4-stroke dual-fuel class in current fleet service, specified on the world\'s largest LNG carriers. Unmatched power output and operational flexibility.',
  },
];
