import type {
  ValuePillar,
  DoctorProfile,
  FacilityDetail,
  MilestoneTimeline,
} from "../types";

export const ABOUT_HERO_DATA = {
  subtitle:
    "AVC provides routine veterinary care, diagnostics, surgery, and 24/7 emergency support at Sector 90. Boarding and pet-care services are available at Sector 87.",
};

export const VALUE_PILLARS: ValuePillar[] = [
  {
    id: "compassion",
    icon: "🐾",
    title: "Cat-friendly care",
    subtitle: "Low-stress visits",
    description:
      "Cats have a separate, quiet consultation space. Our team also aims to make visits comfortable for dogs and cats.",
  },
  {
    id: "surgical",
    icon: "🔬",
    title: "Diagnostics and surgery",
    subtitle: "In-house services",
    description:
      "The Sector 90 hospital has an in-house diagnostic lab, imaging, and an operating theatre for planned and emergency procedures.",
  },
  {
    id: "emergency",
    icon: "🚨",
    title: "Emergency care",
    subtitle: "Open 24/7",
    description:
      "The Sector 90 hospital provides emergency and intensive care around the clock.",
  },
  {
    id: "ecosystem",
    icon: "🌿",
    title: "Two locations",
    subtitle: "Hospital and boarding",
    description:
      "AVC provides veterinary care at Sector 90 and boarding services at Sector 87.",
  },
];

export const FOUNDER_DATA = {
  name: "Dr. Hardeep Beniwal",
  degrees: "B.V.Sc & A.H., M.I.S.V.S.",
  role: "Founder & Chief Veterinary Surgeon",
  storyParagraphs: [
    "Dr. Hardeep Beniwal founded AVC in 2022 to provide multispeciality veterinary care in Gurugram.",
    "His clinical work includes soft-tissue and orthopedic surgery. The Sector 90 hospital brings diagnostics, surgery, and 24/7 emergency care together.",
    "AVC also operates Pet World in Sector 87, which offers boarding and pet-care services.",
  ],
  specialties: [
    "Soft-tissue and orthopedic surgery",
    "Trauma and critical care",
    "Internal medicine",
    "Diagnostic imaging",
  ],
  image: "/images/doctor-hardeep-hero.png",
};

export const FACILITIES_SHOWCASE: FacilityDetail[] = [
  {
    id: "modular-ot",
    title: "Operating theatre",
    subtitle: "Surgery",
    description:
      "Surgical procedures are supported by anesthesia monitoring, electrocautery, and dedicated recovery beds.",
    highlights: [
      "Multiparameter anesthesia monitoring",
      "Sterile positive-pressure airflow",
      "Laparoscopic & soft-tissue surgical gear",
      "Dedicated postoperative recovery beds",
    ],
    image: "/images/service-advanced-surgery-ot.jpg",
    campus: "Sector 90 Hospital",
  },
  {
    id: "idexx-lab",
    title: "Diagnostic lab and imaging",
    subtitle: "Diagnostics",
    description:
      "In-house lab testing, X-ray, ultrasound, and echocardiography support diagnosis and treatment planning.",
    highlights: [
      "Automated hematology & blood gas analysis",
      "Biochemistry and hematology testing",
      "Digital X-ray",
      "Ultrasound and echocardiography",
    ],
    image: "/images/service-diagnostic-lab-pathology.jpg",
    campus: "Sector 90 Hospital",
  },
  {
    id: "cat-care",
    title: "Cat Care OPD",
    subtitle: "Feline care",
    description:
      "A dedicated cat-care space helps keep feline patients separate from dogs and other noise.",
    highlights: [
      "Feline-dedicated examination suite",
      "Pheromone diffuser",
      "Gentle handling",
      "Care for kittens and senior cats",
    ],
    image: "/images/service-feline-cat-care.jpg",
    campus: "Sector 90 Hospital",
  },
  {
    id: "critical-care-icu",
    title: "Critical Care ICU",
    subtitle: "24/7 emergency care",
    description:
      "The Sector 90 hospital provides oxygen therapy, infusion support, and continuous monitoring for critical patients.",
    highlights: [
      "Temperature-controlled oxygenation kennels",
      "Round-the-clock intensive vet nursing",
      "Hemodialysis & blood transfusion setup",
      "Emergency trauma stabilization unit",
    ],
    image: "/images/service-24-7-emergency-care.jpg",
    campus: "Sector 90 Hospital",
  },
  {
    id: "pet-world-resort",
    title: "AVC Pet World",
    subtitle: "Boarding",
    description:
      "Boarding and pet-care services are available at Sector 87, with play areas and a swimming pool.",
    highlights: [
      "Spacious climate-controlled private suites",
      "Agility play lawns & splash swimming pool",
      "Custom vet-approved nutritional meals",
      "24/7 CCTV surveillance & daily photo updates",
    ],
    image: "/images/facility-pet-resort-boarding.jpg",
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
    bio: "Veterinary surgeon with experience in orthopedic and soft-tissue surgery.",
    image: "/images/doctor-hardeep-cutout.png",
  },
  {
    id: "dr-internal-medicine",
    name: "Dr. Neha Sharma",
    role: "Senior Consultant – Internal Medicine",
    qualifications: "B.V.Sc & A.H., M.V.Sc (Medicine)",
    experience: "8+ Years Experience",
    specialty: "Canine & Feline Nephrology & Endocrinology",
    bio: "Works in internal medicine, renal care, endocrine disorders, and feline medicine.",
    image: "/images/doctor-dr-hardeep-with-cat.jpg",
  },
  {
    id: "dr-emergency-icu",
    name: "Dr. Rohit Verma",
    role: "Critical Care & Emergency Specialist",
    qualifications: "B.V.Sc & A.H., Emergency Medicine Fellow",
    experience: "6+ Years Experience",
    specialty: "Trauma Management & Critical Care ICU",
    bio: "Provides emergency and critical care, including trauma management and resuscitation.",
    image: "/images/doctor-dr-hardeep-opd-consult.jpg",
  },
];

export const MILESTONES_TIMELINE: MilestoneTimeline[] = [
  {
    year: "2012 - 2021",
    title: "Clinical work in Delhi-NCR",
    description:
      "Dr. Beniwal worked in veterinary practices across the region, focusing on surgery, diagnostics, and emergency care.",
  },
  {
    year: "2022",
    title: "AVC opens in Sector 90",
    description:
      "The hospital opened with an operating theatre, in-house diagnostics, and 24/7 emergency care.",
  },
  {
    year: "2023",
    title: "Cat Care OPD and ICU expansion",
    description:
      "AVC added a dedicated cat-care space and expanded ICU capacity.",
  },
  {
    year: "2024",
    title: "AVC Pet World opens in Sector 87",
    description:
      "The Sector 87 location offers boarding, play areas, and a swimming pool.",
  },
  {
    year: "Today",
    title: "Veterinary care across two locations",
    description:
      "AVC provides emergency, surgical, diagnostic, and routine veterinary care in Gurugram.",
  },
];
