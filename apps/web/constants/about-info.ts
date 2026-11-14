import type {
  ValuePillar,
  DoctorProfile,
  FacilityDetail,
  MilestoneTimeline,
} from "../types";

export const ABOUT_HERO_DATA = {
  badge: "Pioneering Veterinary Excellence Since 2022",
  title: "Compassionate Healing, Advanced Veterinary Precision",
  subtitle:
    "Founded on the unwavering belief that every companion animal deserves top-tier surgical, emergency, and wellness care. AVC Multispeciality Pet Care Hospital combines state-of-the-art diagnostic technology with deep clinical empathy in Gurugram, Haryana.",
  motto: "“The bond between humans and animals is a silent language of trust and love.”",
  emergencyHelp: "24/7 Trauma & Emergency ICU: +91 99900 70026",
  stats: [
    { value: "12+", label: "Years Combined Clinical Excellence" },
    { value: "4,200+", label: "Successful Surgeries & Procedures" },
    { value: "2,500+", label: "Devoted Pet Parents" },
    { value: "24/7", label: "Critical Care ICU & Emergency" },
  ],
};

export const VALUE_PILLARS: ValuePillar[] = [
  {
    id: "compassion",
    icon: "🐾",
    title: "Fear-Free & Feline-Friendly Care",
    subtitle: "Low-Stress Environment",
    description:
      "We design separate, quiet consultation suites and treatment zones so sensitive dogs and cats experience zero anxiety and maximum comfort.",
    badge: "Specialized Cat Care OPD",
  },
  {
    id: "surgical",
    icon: "🔬",
    title: "Advanced Surgical & Diagnostic Rigor",
    subtitle: "High-Tech Clinical Accuracy",
    description:
      "Fully equipped with sterile modular operation theatres, multiparameter monitors, IDEXX in-house pathology lab, digital X-Ray, ultrasound, and endoscopy.",
    badge: "IDEXX & Modular OT",
  },
  {
    id: "emergency",
    icon: "🚨",
    title: "24/7 Continuous Emergency Vigilance",
    subtitle: "Immediate Critical Response",
    description:
      "Accidents and sudden illnesses don't keep office hours. Our emergency response team, trauma doctors, and ICU remain fully staffed around the clock.",
    badge: "Round the Clock ICU",
  },
  {
    id: "ecosystem",
    icon: "🌿",
    title: "Holistic 360° Animal Wellness",
    subtitle: "Hospital to Luxury Resort",
    description:
      "From emergency trauma and complex surgeries to preventive vaccinations, therapeutic grooming, and luxury boarding at AVC Pet World Sector 87.",
    badge: "2 Centers in Gurugram",
  },
];

export const FOUNDER_DATA = {
  name: "Dr. Hardeep Beniwal",
  degrees: "B.V.Sc & A.H., M.I.S.V.S.",
  role: "Founder & Chief Veterinary Surgeon",
  experience: "12+ Years of Clinical & Surgical Mastery",
  quote:
    "Our goal was never just to build a clinic; we set out to create a sanctuary where medical mastery meets tender empathy. Every pet that walks through our doors is treated with the same meticulous care and love as our own family members.",
  storyParagraphs: [
    "Dr. Hardeep Beniwal established AVC Multispeciality Pet Care Hospital with a distinct mission: bringing multi-speciality veterinary standards—comparable to modern human healthcare—to Gurugram's companion animal community.",
    "Over more than a decade of specialized clinical practice and complex soft-tissue and orthopedic surgeries, Dr. Beniwal recognized that pet parents needed an integrated center where advanced diagnostics, sterile surgical suites, and dedicated intensive care operate under one roof 24/7.",
    "Under his leadership, AVC has expanded into two signature destinations in Gurugram: the Sector 90 Multi-Speciality Hospital and the Sector 87 AVC Pet World Luxury Resort, setting new regional benchmarks in pet wellness and emergency surgery.",
  ],
  specialties: [
    "Complex Soft-Tissue Surgery",
    "Orthopedic & Trauma Surgery",
    "Critical Care & Emergency Triage",
    "Internal Medicine & Minimally Invasive Care",
  ],
  image: "/images/doctor-hardeep-hero.png",
};

export const FACILITIES_SHOWCASE: FacilityDetail[] = [
  {
    id: "modular-ot",
    title: "Sterile Modular Operation Theater (OT)",
    subtitle: "Precision Surgical Suite",
    description:
      "State-of-the-art sterile surgical theater equipped with multiparameter cardiovascular monitors, electrocautery, and specialized surgical lighting for routine and complex life-saving procedures.",
    highlights: [
      "Multiparameter anesthesia monitoring",
      "Sterile positive-pressure airflow",
      "Laparoscopic & soft-tissue surgical gear",
      "Dedicated postoperative recovery beds",
    ],
    image: "/images/service-advanced-surgery-ot.jpg",
    badge: "Modular Surgical Suite",
    campus: "Sector 90 Hospital",
  },
  {
    id: "idexx-lab",
    title: "In-House Advanced Diagnostic Pathology",
    subtitle: "Rapid 15-Minute Test Results",
    description:
      "Fully integrated laboratory powered by automated biochemistry analyzers, hematology counters, and digital microscopy to diagnose critical conditions with pinpoint accuracy.",
    highlights: [
      "Automated hematology & blood gas analysis",
      "Biochemistry profiling within 15 minutes",
      "High-resolution digital radiography (X-Ray)",
      "High-frequency ultrasound & echocardiography",
    ],
    image: "/images/service-diagnostic-lab-pathology.jpg",
    badge: "IDEXX & Digital Imaging",
    campus: "Sector 90 Hospital",
  },
  {
    id: "cat-care",
    title: "Specialized Cat Care OPD & Feline Suites",
    subtitle: "Stress-Free Feline Medicine",
    description:
      "Cats have unique psychological and physiological needs. Our quiet Cat Care OPD isolates feline patients from barking dogs, loud noises, and stressful stimuli.",
    highlights: [
      "Feline-dedicated examination suite",
      "Calming pheromone diffusing system",
      "Gentle, fear-free handling protocols",
      "Specific feline pediatric & senior medicine",
    ],
    image: "/images/service-feline-cat-care.jpg",
    badge: "Feline Friendly",
    campus: "Sector 90 Hospital",
  },
  {
    id: "critical-care-icu",
    title: "24/7 Critical Care & Intensive Care Unit (ICU)",
    subtitle: "Continuous Patient Monitoring",
    description:
      "Equipped with oxygen therapy cages, continuous infusion pumps, emergency crash carts, and dedicated veterinary staff monitoring critical patients 24 hours a day.",
    highlights: [
      "Temperature-controlled oxygenation kennels",
      "Round-the-clock intensive vet nursing",
      "Hemodialysis & blood transfusion setup",
      "Emergency trauma stabilization unit",
    ],
    image: "/images/service-24-7-emergency-care.jpg",
    badge: "24/7 Live Monitoring",
    campus: "Sector 90 Hospital",
  },
  {
    id: "pet-world-resort",
    title: "AVC Pet World Luxury Boarding & Resort",
    subtitle: "Sector 87 Luxury Haven",
    description:
      "A peaceful oasis opposite Ansal Heights featuring air-conditioned suites, expansive agility play zones, a pet swimming pool, and continuous veterinary supervision.",
    highlights: [
      "Spacious climate-controlled private suites",
      "Agility play lawns & splash swimming pool",
      "Custom vet-approved nutritional meals",
      "24/7 CCTV surveillance & daily photo updates",
    ],
    image: "/images/facility-pet-resort-boarding.jpg",
    badge: "Luxury Boarding & Daycare",
    campus: "Sector 87 Pet World Resort",
  },
];

export const VETERINARY_TEAM: DoctorProfile[] = [
  {
    id: "dr-hardeep-beniwal",
    name: "Dr. Hardeep Beniwal",
    role: "Founder & Chief Veterinary Surgeon",
    qualifications: "B.V.Sc & A.H., M.I.S.V.S.",
    experience: "12+ Years Experience",
    specialty: "Advanced Orthopedic & Soft-Tissue Surgery",
    bio: "Pioneered trauma triage and surgical standards in Gurugram, having conducted thousands of life-saving operations with gentle empathy.",
    image: "/images/doctor-hardeep-cutout.png",
    stats: { label: "Surgeries Performed", value: "3,800+" },
  },
  {
    id: "dr-internal-medicine",
    name: "Dr. Neha Sharma",
    role: "Senior Consultant – Internal Medicine",
    qualifications: "B.V.Sc & A.H., M.V.Sc (Medicine)",
    experience: "8+ Years Experience",
    specialty: "Canine & Feline Nephrology & Endocrinology",
    bio: "Specializes in chronic disease management, feline geriatrics, renal therapeutics, and precision diagnostics.",
    image: "/images/doctor-dr-hardeep-with-cat.jpg",
    stats: { label: "Cases Managed", value: "2,200+" },
  },
  {
    id: "dr-emergency-icu",
    name: "Dr. Rohit Verma",
    role: "Critical Care & Emergency Specialist",
    qualifications: "B.V.Sc & A.H., Emergency Medicine Fellow",
    experience: "6+ Years Experience",
    specialty: "Trauma Management & Critical Care ICU",
    bio: "Leads our 24/7 emergency unit, specializing in acute poisonings, polytrauma resuscitation, and cardiopulmonary support.",
    image: "/images/doctor-dr-hardeep-opd-consult.jpg",
    stats: { label: "Emergency Interventions", value: "1,500+" },
  },
];

export const MILESTONES_TIMELINE: MilestoneTimeline[] = [
  {
    year: "2012 - 2021",
    title: "Foundation of Clinical Mastery",
    description:
      "Over a decade of surgical, diagnostic, and emergency leadership in premier veterinary practices across Delhi-NCR.",
    badge: "Clinical Foundations",
  },
  {
    year: "2022",
    title: "Launch of AVC Multispeciality Hospital",
    description:
      "Established the flagship Sector 90 hospital with Gurugram's most modern modular OT, IDEXX lab, and 24/7 emergency unit.",
    badge: "Hospital Launch",
  },
  {
    year: "2023",
    title: "Dedicated Cat Care OPD & ICU Expansion",
    description:
      "Introduced a specialized stress-free feline outpatient suite and doubled ICU critical care capacity.",
    badge: "Feline Wing & ICU",
  },
  {
    year: "2024",
    title: "Inauguration of AVC Pet World Resort",
    description:
      "Opened our expansive Sector 87 luxury boarding, agility play garden, and swimming pool complex opposite Ansal Heights.",
    badge: "Resort Extension",
  },
  {
    year: "Today",
    title: "Trusted by 2,500+ Pet Families",
    description:
      "Over 4,200 surgeries completed with industry-leading success rates and 24/7 continuous veterinary care.",
    badge: "Excellence in Care",
  },
];
