export type NavItem = {
  label: string;
  href: string;
  isExternal?: boolean;
};

export type ServiceItem = {
  id: string;
  title: string;
  description: string;
  icon: string;
  image?: string;
  badge?: string;
  href?: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type TestimonialItem = {
  id: string;
  author: string;
  pet?: string;
  review: string;
  avatar: string;
};

export type ProcessStep = {
  step: string;
  title: string;
  description: string;
  image: string;
};

export type SpeciesItem = {
  id: string;
  name: string;
  image: string;
  description: string;
};

export type HospitalCenter = {
  name: string;
  type: string;
  address: string;
  landmark: string;
  city: string;
  pincode: string;
};

export type HospitalInfo = {
  name: string;
  subtitle: string;
  tagline: string;
  quote: string;
  emergencyPhone: string;
  phone: string;
  secondaryPhone: string;
  email: string;
  hospitalCenter: HospitalCenter;
  resortCenter: HospitalCenter;
  routineHours: string;
  emergencyHours: string;
};

export type ValuePillar = {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  badge?: string;
};

export type DoctorProfile = {
  id: string;
  name: string;
  role: string;
  qualifications: string;
  experience: string;
  specialty: string;
  bio: string;
  image: string;
  stats?: { label: string; value: string };
};

export type FacilityDetail = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  image: string;
  badge?: string;
  campus: "Sector 90 Hospital" | "Sector 87 Pet World Resort";
};

export type MilestoneTimeline = {
  year: string;
  title: string;
  description: string;
  badge?: string;
};
