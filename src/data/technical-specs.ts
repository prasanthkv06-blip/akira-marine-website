import type { EngineModel } from '@/types';

export const engineModels: EngineModel[] = [
  {
    id: 'w31df',
    name: 'Wärtsilä 31DF',
    type: '4-stroke, dual-fuel',
    cylinders: '8V, 10V, 12V, 14V, 16V',
    power: '4,880 – 9,760 kW',
    speed: '720 / 750 rpm',
    fuelModes: ['Natural Gas (LNG)', 'Marine Diesel Oil (MDO)', 'Heavy Fuel Oil (HFO)'],
    description: 'The most efficient 4-stroke engine in the world. The Wärtsilä 31DF sets the benchmark for fuel efficiency in its class, offering unmatched operational flexibility across multiple fuel types.',
  },
  {
    id: 'w34df',
    name: 'Wärtsilä 34DF',
    type: '4-stroke, dual-fuel',
    cylinders: '6L, 8V, 9L, 12V, 16V',
    power: '2,880 – 7,680 kW',
    speed: '720 / 750 rpm',
    fuelModes: ['Natural Gas (LNG)', 'Marine Diesel Oil (MDO)', 'Heavy Fuel Oil (HFO)'],
    description: 'A proven and reliable workhorse for LNG carriers and marine propulsion. The 34DF delivers excellent power density with seamless fuel switching capability and low emissions.',
  },
  {
    id: 'w46df',
    name: 'Wärtsilä 46DF',
    type: '4-stroke, dual-fuel',
    cylinders: '6L, 8L, 9L, 12V, 14V, 16V',
    power: '5,700 – 15,200 kW',
    speed: '500 / 514 rpm',
    fuelModes: ['Natural Gas (LNG)', 'Marine Diesel Oil (MDO)', 'Heavy Fuel Oil (HFO)'],
    description: 'The flagship dual-fuel engine for large LNG carriers and power generation. The 46DF combines high power output with exceptional fuel flexibility and environmental performance.',
  },
];
