export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface Service {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  icon: string;
  image: string;
  features: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  yearsExperience: number;
  image: string;
  certifications: string[];
}

export interface EngineComponent {
  id: string;
  name: string;
  svgPath: string;
  hotspotX: number;
  hotspotY: number;
  description: string;
  services: string[];
  relatedLink: string;
}

export interface Stat {
  id: string;
  value: number;
  suffix: string;
  label: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  description: string;
  image: string;
}

export interface Capability {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

export interface EngineModel {
  id: string;
  name: string;
  type: string;
  cylinders: string;
  power: string;
  speed: string;
  fuelModes: string[];
  description: string;
}
