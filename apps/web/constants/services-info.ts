import type {
  DetailedServiceItem,
  TriageItem,
  CareWorkflowStep,
  FaqItem,
} from "../types";
import { HOSPITAL_INFO } from "./hospital-info";

export const SERVICES_HERO_DATA = {
  badge: "Multispeciality Clinical Services in Gurugram",
  title: "Complete Veterinary Healthcare, from Emergency ICU to Luxury Resort",
  subtitle:
    "Explore our full spectrum of specialized medicine, sterile surgical theaters, rapid IDEXX pathology, feline-exclusive suites, and cage-free resort care across Sector 90 and Sector 87.",
  emergencyPhone: HOSPITAL_INFO.emergencyPhone,
  resortPhone: HOSPITAL_INFO.secondaryPhone,
  stats: [
    { value: "24/7/365", label: "Trauma ICU & Emergency Readiness" },
    { value: "15-Min", label: "Rapid IDEXX Diagnostic Turnaround" },
    { value: "4,200+", label: "Successful Surgical Interventions" },
    { value: "2 Campuses", label: "Sector 90 Hospital & Sector 87 Resort" },
  ],
};

export const SERVICE_CATEGORIES = [
  { id: "all", label: "All Services" },
  { id: "emergency", label: "24/7 Emergency & ICU" },
  { id: "surgery", label: "Surgeries & Modular OT" },
  { id: "diagnostics", label: "Diagnostics & Labs" },
  { id: "wellness", label: "OPD & Preventive" },
  { id: "feline", label: "Cat Care OPD" },
  { id: "resort", label: "Boarding, Daycare & Spa" },
] as const;

export const DETAILED_SERVICES: DetailedServiceItem[] = [
  {
    id: "emergency-icu",
    category: "emergency",
    title: "24/7 Trauma, Critical Care & Emergency ICU",
    subtitle: "Immediate Life-Saving Resuscitation Round-the-Clock",
    description:
      "When seconds count, our Sector 90 Intensive Care Unit is fully manned by emergency veterinary surgeons, critical care nurses, and on-site oxygen therapy cages. We accept all urgent walk-ins without appointment.",
    whatWeTreat: [
      "Road traffic accidents, polytrauma & acute fractures",
      "Severe poisoning, toxic plant/chemical ingestion",
      "Acute respiratory distress, choking & collapse",
      "Gastric torsion (GDV/bloat) & internal hemorrhage",
      "Seizures, heatstroke & shock resuscitation",
    ],
    equipmentAndTech: [
      "Temperature-controlled oxygenation kennels",
      "Multiparameter cardiovascular monitors & defibrillators",
      "Continuous infusion syringe pumps & fluid warmers",
      "Hemodialysis setup & emergency blood transfusion bank",
    ],
    image: "/images/service-24-7-emergency-care.jpg",
    badge: "Open 24/7 · Walk-ins Welcome",
    campus: "Sector 90 Hospital",
    phone: HOSPITAL_INFO.emergencyPhone,
    ctaLabel: `Emergency ICU: ${HOSPITAL_INFO.emergencyPhone}`,
  },
  {
    id: "surgical-services",
    category: "surgery",
    title: "Advanced Soft-Tissue & Orthopedic Surgery",
    subtitle: "Sterile Modular Positive-Pressure Operating Suites",
    description:
      "Led by Chief Veterinary Surgeon Dr. Hardeep Beniwal, our surgical department executes both routine and high-complexity procedures in sterile modular OTs equipped with inhalation anesthesia and real-time vital tracking.",
    whatWeTreat: [
      "Cruciate ligament repair & bone fracture fixation",
      "Oncological tumor & mass removals with clear margins",
      "Minimally invasive laparoscopic spaying & gastropexy",
      "Intestinal foreign body removals & splenectomy",
      "C-sections & high-risk emergency surgeries",
    ],
    equipmentAndTech: [
      "Positive-pressure sterile modular OT airflow",
      "Isoflurane/Sevoflurane precision gas anesthesia",
      "Bipolar & monopolar surgical electrocautery",
      "Rigid surgical endoscopy & orthopedic power tools",
    ],
    image: "/images/service-advanced-surgery-ot.jpg",
    badge: "Modular Sterile OT",
    campus: "Sector 90 Hospital",
    phone: HOSPITAL_INFO.phone,
    ctaLabel: "Schedule Surgical Consult",
  },
  {
    id: "diagnostic-pathology",
    category: "diagnostics",
    title: "In-House Diagnostic Pathology & Digital Imaging",
    subtitle: "15-Minute Laboratory Reports for Fast, Accurate Diagnosis",
    description:
      "Eliminating the delay of sending samples to third-party labs, our integrated IDEXX diagnostic lab and high-frequency digital radiography enable doctors to begin targeted treatments immediately.",
    whatWeTreat: [
      "Complete blood counts (CBC), organ biochemistry & electrolytes",
      "Digital X-Ray for musculoskeletal and chest trauma",
      "Abdominal ultrasound & Doppler echocardiography",
      "Endoscopy for digestive tract examination & biopsies",
      "Urinalysis, cytology & infectious disease testing (Parvo, FeLV, FIV)",
    ],
    equipmentAndTech: [
      "IDEXX automated hematology & biochemistry analyzers",
      "High-frequency digital X-Ray (DR System)",
      "High-resolution color Doppler ultrasound",
      "Multi-lead veterinary ECG system",
    ],
    image: "/images/service-diagnostic-lab-pathology.jpg",
    badge: "15-Min IDEXX Lab",
    campus: "Sector 90 Hospital",
    phone: HOSPITAL_INFO.phone,
    ctaLabel: "Book Lab & Imaging",
  },
  {
    id: "cat-care-opd",
    category: "feline",
    title: "Specialized Cat Care OPD & Feline Suite",
    subtitle: "Quiet, Fear-Free Environment Designed Exclusively for Cats",
    description:
      "Felines experience intense sensory stress around barking dogs and noisy hospital lobbies. Our dedicated Cat Care OPD provides separate acoustic isolation, soothing feline pheromones, and gentle handling protocols.",
    whatWeTreat: [
      "Feline Lower Urinary Tract Disease (FLUTD)",
      "Chronic kidney disease (CKD) & renal therapeutics",
      "Feline upper respiratory infections (Cat flu)",
      "Kitten core immunizations & deworming",
      "Senior cat arthritis & metabolic management",
    ],
    equipmentAndTech: [
      "Feline-exclusive consultation & treatment rooms",
      "Feliway pheromone diffusion environment",
      "Low-stress weighing scales & feline pediatric tools",
      "Gentle low-volume diagnostic equipment",
    ],
    image: "/images/service-feline-cat-care.jpg",
    badge: "Feline-Friendly Zone",
    campus: "Sector 90 Hospital",
    phone: HOSPITAL_INFO.phone,
    ctaLabel: "Book Cat Care Consult",
  },
  {
    id: "opd-preventive",
    category: "wellness",
    title: "OPD Consultations & Preventive Healthcare",
    subtitle: "Routine Health Checkups, Vaccines & Lifetime Wellness Plans",
    description:
      "Preventive medicine is the cornerstone of pet longevity. Our doctors provide comprehensive nose-to-tail physical examinations, customized vaccination schedules, microchipping, and lifestyle nutrition plans.",
    whatWeTreat: [
      "Annual and bi-annual comprehensive physical exams",
      "Canine (DHPPi, Rabies, KC) & Feline (Tricat) vaccinations",
      "Dermatology, hot-spots, ear infections & allergy management",
      "Puppy and kitten growth checkups & microchipping",
      "Geriatric wellness screening for aging pets",
    ],
    equipmentAndTech: [
      "Digital pet health record management",
      "Otoscopic and ophthalmic diagnostic sets",
      "Cold laser therapy for arthritis & wound healing",
      "Certified microchip scanners and registration",
    ],
    image: "/images/service-opd-general-consultation.jpg",
    badge: "Comprehensive OPD",
    campus: "Both Campuses",
    phone: HOSPITAL_INFO.phone,
    ctaLabel: "Book Doctor Appointment",
  },
  {
    id: "pet-boarding-resort",
    category: "resort",
    title: "AVC Pet World Luxury Boarding & Daycare",
    subtitle: "Air-Conditioned Private Suites, Agility Grounds & Splash Pool",
    description:
      "Located in Sector 87 opposite Ansal Heights, AVC Pet World is Gurugram's premier cage-free luxury pet resort. Pets enjoy climate-controlled rooms, supervised social play, swimming sessions, and 24/7 veterinary supervision.",
    whatWeTreat: [
      "Short-term daycare and extended vacation boarding",
      "Medical boarding for pets requiring daily medications",
      "Supervised socialization & energy burn playgroups",
      "Hydrotherapy & swim sessions in pet splash pool",
      "Daily WhatsApp photo & video updates for pet parents",
    ],
    equipmentAndTech: [
      "Individual air-conditioned suites with sound dampening",
      "Expansive grass agility grounds with secure fences",
      "Filtered, sanitized pet-safe swimming pool",
      "24/7 CCTV surveillance & dedicated caretakers",
    ],
    image: "/images/facility-pet-resort-boarding.jpg",
    badge: "Sector 87 Luxury Resort",
    campus: "Sector 87 Pet World Resort",
    phone: HOSPITAL_INFO.secondaryPhone,
    ctaLabel: `Book Boarding: ${HOSPITAL_INFO.secondaryPhone}`,
  },
  {
    id: "grooming-spa",
    category: "resort",
    title: "Therapeutic Pet Grooming & Spa",
    subtitle: "Medicated Baths, Breed-Specific Styling & Hygiene Care",
    description:
      "Our certified pet groomers combine grooming artistry with dermatological care. From anti-tick & fungal medicated baths to show-standard scissoring, we ensure your pet looks, smells, and feels their best.",
    whatWeTreat: [
      "Medicated baths for dermatitis, fungal infections & ticks",
      "Breed-standard breed cuts & sanitary trims",
      "Deep deshedding treatment & high-velocity blow-drying",
      "Nail clipping, paw pad moisturizing & ear cleaning",
      "Teeth brushing & mouth freshening hygiene",
    ],
    equipmentAndTech: [
      "Ergonomic hydraulic grooming tables",
      "Temperature-controlled hydrotherapy wash tubs",
      "Silent low-noise variable speed blow dryers",
      "Sterilized professional stainless-steel shears",
    ],
    image: "/images/service-pet-grooming-spa.jpg",
    badge: "Hydrotherapy Spa",
    campus: "Sector 87 Pet World Resort",
    phone: HOSPITAL_INFO.secondaryPhone,
    ctaLabel: "Book Grooming Session",
  },
  {
    id: "pharmacy-products",
    category: "wellness",
    title: "24/7 On-Site Veterinary Pharmacy & Store",
    subtitle: "Prescription Medications, Veterinary Diets & Accessories",
    description:
      "Never scramble for life-saving veterinary medicines late at night. Our hospital houses a fully stocked 24/7 pharmacy offering prescription cardiac, renal, antibiotic, and specialized prescription food supplies.",
    whatWeTreat: [
      "24/7 prescription veterinary pharmaceuticals & injectables",
      "Therapeutic clinical prescription diets (Royal Canin, Hills)",
      "Joint, skin, liver & gastrointestinal nutritional supplements",
      "Tick, flea & heartworm preventive treatments",
      "Post-operative recovery collars, harnesses & wound wraps",
    ],
    equipmentAndTech: [
      "Cold-chain biological vaccine refrigerators",
      "Computerized inventory tracking for batch integrity",
      "Prescription review by registered veterinary pharmacists",
      "24/7 walk-in billing and direct dispensing",
    ],
    image: "/images/service-pet-pharmacy-store.jpg",
    badge: "24/7 Walk-In Pharmacy",
    campus: "Sector 90 Hospital",
    phone: HOSPITAL_INFO.phone,
    ctaLabel: "Check Pharmacy Stock",
  },
  {
    id: "dental-oral-care",
    category: "surgery",
    title: "Veterinary Dentistry & Ultrasonic Scaling",
    subtitle: "Complete Oral Health, Tartar Removal & Extractions",
    description:
      "Periodontal disease affects over 80% of pets by age 3. Our dental suite provides safe ultrasonic scaling, subgingival polishing, and dental radiography under monitored anesthesia to prevent heart and kidney complications.",
    whatWeTreat: [
      "Severe tartar, calculus buildup & gingivitis",
      "Fractured, abscessed or infected teeth extractions",
      "Stomatitis in cats & chronic oral ulcerations",
      "Oral mass evaluation & biopsies",
      "Bad breath (halitosis) diagnosis & treatment",
    ],
    equipmentAndTech: [
      "Piezo ultrasonic veterinary dental scaler",
      "High-speed dental drill & polishing handpiece",
      "Endotracheal cuffed intubation for airway protection",
      "Digital intraoral dental radiography",
    ],
    image: "/images/service-general-treatment-clinic.jpg",
    badge: "Dental Suite",
    campus: "Sector 90 Hospital",
    phone: HOSPITAL_INFO.phone,
    ctaLabel: "Schedule Dental Checkup",
  },
];

export const TRIAGE_GUIDE: TriageItem[] = [
  {
    id: "emergency-triage",
    title: "Immediate Emergency (Walk-In Now 24/7)",
    level: "emergency",
    symptoms: [
      "Difficulty breathing, choking, or persistent blue/pale gums",
      "Hit-by-car (trauma), major bleeding, or suspected bone fracture",
      "Suspected poisoning, chocolate, lily, or rodenticide ingestion",
      "Inability to urinate (especially male cats straining in litter box)",
      "Uncontrolled vomiting with blood or bloated, distended abdomen",
      "Active seizures lasting over 2 minutes or multiple seizures in a day",
      "Sudden collapse, paralysis, or unresponsiveness",
    ],
    recommendedAction:
      "Do NOT wait for an appointment. Bring your pet directly to AVC Sector 90 Trauma ICU. Call our emergency helpline en route so our surgeons prepare the crash cart.",
    timeframe: "Immediate Attention (Zero Wait Time)",
    actionText: `Call Emergency ICU: ${HOSPITAL_INFO.emergencyPhone}`,
    actionHref: `tel:${HOSPITAL_INFO.emergencyPhone.replace(/\s+/g, "")}`,
  },
  {
    id: "routine-triage",
    title: "Scheduled OPD (Book Appointment)",
    level: "routine",
    symptoms: [
      "Annual health checkups, wellness reviews & booster vaccinations",
      "Skin itching, mild ear discharge, or localized hair loss",
      "Gradual limping or mild joint stiffness after sleeping",
      "Mild change in appetite or soft stool without severe lethargy",
      "Bad breath, mild tartar buildup, or routine dental consult",
      "New puppy or kitten routine health check & microchipping",
      "Elective spaying, neutering, or routine blood screening",
    ],
    recommendedAction:
      "Book a scheduled consultation slot to secure your preferred doctor and minimize waiting time. Same-day appointments are available.",
    timeframe: "Same-Day / Next-Day Scheduled Slots",
    actionText: "Book Doctor Appointment",
    actionHref: "/#contact",
  },
];

export const CARE_WORKFLOW: CareWorkflowStep[] = [
  {
    step: "01",
    title: "Instant Triage & Warm Check-In",
    subtitle: "Fast Registration & Priority Sorting",
    description:
      "Upon arrival, critical patients are immediately whisked to the ICU while routine patients are welcomed into species-separated, quiet waiting zones.",
    highlight: "Zero wait time for trauma",
  },
  {
    step: "02",
    title: "Comprehensive Clinical Examination",
    subtitle: "Nose-to-Tail Physical Assessment",
    description:
      "An experienced veterinary physician examines vital parameters—cardiovascular rhythm, respiratory sounds, temperature, and musculoskeletal mobility.",
    highlight: "Dedicated Feline & Canine Suites",
  },
  {
    step: "03",
    title: "In-House Precision Diagnostics",
    subtitle: "15-Minute Lab Reports & Digital Imaging",
    description:
      "When tests are warranted, our on-site IDEXX laboratory and digital X-Ray provide immediate objective clarity without leaving the premises.",
    highlight: "Real-time diagnostic answers",
  },
  {
    step: "04",
    title: "Transparent Plan & Gentle Recovery",
    subtitle: "Clear Explanation & Follow-Up Care",
    description:
      "Doctors walk pet parents through treatment options, medication schedules, and transparent estimates before administering care.",
    highlight: "Full price & treatment transparency",
  },
];

export const SERVICES_FAQS: FaqItem[] = [
  {
    question: "Do I need to book an appointment for an emergency?",
    answer:
      "No. Our Emergency & Trauma ICU at Sector 90 is staffed with veterinary surgeons and emergency nurses 24 hours a day, 365 days a year. You can walk in immediately. Calling us at +91 99900 70026 while on the way helps us prepare oxygen and surgical equipment before you arrive.",
  },
  {
    question: "How quickly do you provide laboratory and blood test results?",
    answer:
      "Because we operate our own in-house IDEXX diagnostic lab, most routine biochemistry, hematology, and blood gas results are ready within 15 to 20 minutes, allowing our doctors to prescribe targeted treatments immediately.",
  },
  {
    question: "What makes your Cat Care OPD different from regular clinics?",
    answer:
      "Our Cat Care OPD features separate feline-only examination rooms isolated from barking dogs and unfamiliar scents. We utilize continuous Feliway pheromone diffusion, gentle fear-free handling, and non-reflective surfaces to keep cats completely calm.",
  },
  {
    question: "What vaccinations are mandatory before boarding a pet at AVC Pet World?",
    answer:
      "To protect all guest pets, dogs must be up to date on DHPPi (Core 7-in-1), Anti-Rabies, and Kennel Cough (Bordetella). Cats must have their Tricat (FVRCP) and Rabies vaccines. All guests also undergo a quick tick/flea inspection upon check-in.",
  },
  {
    question: "Can I get veterinary consultations or blood sample collection at home?",
    answer:
      "Yes. AVC provides mobile home veterinary visits across Gurugram for routine vaccinations, wellness checks, and blood sample pickups. Please call +91 99900 70026 to schedule a home visit.",
  },
];
