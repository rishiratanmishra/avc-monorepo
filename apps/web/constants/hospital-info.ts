import type {
  HospitalInfo,
  ServiceItem,
  FaqItem,
  TestimonialItem,
  ProcessStep,
  SpeciesItem,
} from "../types";

export const HOSPITAL_INFO: HospitalInfo = {
  name: "AVC Multispeciality Pet Care Hospital",
  subtitle: "Animates Vet Care (AVC) Hospital & Luxury Pet Resort",
  tagline: "We are the best multispeciality pet care hospital in Gurugram, Haryana",
  quote: "The bond between humans and animals is a silent language of trust and love.",
  emergencyPhone: "+91 99900 70026",
  phone: "+91 99900 70026",
  secondaryPhone: "+91 74500 28000",
  email: "care@avcpethospital.com",
  hospitalCenter: {
    name: "AVC Multispeciality Pet Care Hospital",
    type: "Hospital & 24/7 Emergency",
    address: "Regal Garden, Badha-Hayatpur Road",
    landmark: "Near DLF Regal Garden, Sector 90",
    city: "Gurugram, Haryana",
    pincode: "122505",
  },
  resortCenter: {
    name: "AVC Pet World Luxury Pet Resort & Boarding Center",
    type: "Luxury Boarding & Daycare",
    address: "Sector 87",
    landmark: "Opposite Ansal Heights",
    city: "Gurugram, Haryana",
    pincode: "122505",
  },
  routineHours: "9:00 AM - 2:00 PM & 4:00 PM - 8:00 PM",
  emergencyHours: "24/7 Available (Round the Clock)",
};

export const HOSPITAL_STATS = [
  { value: "2500+", label: "Happy Pet Parents" },
  { value: "20+", label: "Veterinary Specialists & Surgeons" },
  { value: "4200+", label: "Successful Surgeries & Treatments" },
  { value: "12+", label: "Years of Veterinary Excellence" },
];

export const CORE_SERVICES: ServiceItem[] = [
  {
    id: "cat-care",
    title: "Cat Care OPD",
    description: "Feline-friendly quiet consultation suites designed specifically to keep cats calm and stress-free.",
    icon: "🐱",
    image: "/images/service-feline-cat-care.jpg",
  },
  {
    id: "opd",
    title: "OPD Services",
    description: "Specialized general health checkups, preventive immunizations, diagnosis, and expert pet healthcare plans.",
    icon: "🩺",
    image: "/images/service-opd-general-consultation.jpg",
  },
  {
    id: "boarding",
    title: "Boarding Services",
    description: "Air-conditioned comfortable suites, supervised play areas, and wholesome nutritious meals at AVC Pet World.",
    icon: "🏡",
    image: "/images/about-pet-wellness-companion.jpg",
  },
  {
    id: "grooming",
    title: "Grooming Services",
    description: "Therapeutic medicated baths, breed-specific styling, blow-dry, nail clipping, and oral hygiene care.",
    icon: "✂️",
    image: "/images/service-pet-grooming-spa.jpg",
  },
  {
    id: "preventive",
    title: "Medical Services and Preventive Care",
    description: "Vaccinations, internal medicine, microchipping, and wellness preventive care plans for dogs & cats.",
    icon: "💉",
    image: "/images/service-pet-vaccination-immunization.jpg",
  },
  {
    id: "surgery",
    title: "Surgical Services",
    description: "Sophisticated surgical procedures with modern multiparameter monitors, electrocautery, and sterile modular OT.",
    icon: "🔬",
    image: "/images/service-advanced-surgery-ot.jpg",
  },
  {
    id: "emergency",
    title: "Emergency Services",
    description: "Round-the-clock emergency medical support with dedicated trauma units, oxygen therapy, and critical care ICU.",
    icon: "🚨",
    image: "/images/service-24-7-emergency-care.jpg",
    badge: "24/7 Available",
  },
  {
    id: "products",
    title: "Products and Accessories",
    description: "24/7 on-site pharmacy with prescription veterinary medicines, therapeutic diets, toys, and grooming gear.",
    icon: "💊",
    image: "/images/service-pet-pharmacy-store.jpg",
  },
  {
    id: "labs",
    title: "Advanced Laboratory",
    description: "State-of-the-art diagnostic pathology, biochemistry analyzers, digital X-Ray, ultrasound, and ECG.",
    icon: "📊",
    image: "/images/service-diagnostic-lab-pathology.jpg",
  },
];

export const PET_CARE_PROCESS: ProcessStep[] = [
  {
    step: "01",
    title: "Make Appointment",
    description: "Schedule your visit online or call our 24/7 helpline for quick registration and priority slot booking.",
    image: "/images/process-step1-make-appointment.png",
  },
  {
    step: "02",
    title: "Doctor Assigned",
    description: "An experienced veterinary specialist tailored to your pet's specific medical condition is assigned.",
    image: "/images/process-step2-doctor-assigned.jpg",
  },
  {
    step: "03",
    title: "Get Consultation",
    description: "Comprehensive physical checkup, in-house diagnostics, digital radiography, and personalized care plan.",
    image: "/images/process-step3-consultation.png",
  },
  {
    step: "04",
    title: "Get Cure & Relief",
    description: "Targeted treatment, gentle medication, follow-up monitoring, and quick recovery for your furry companion.",
    image: "/images/process-step4-cure-and-relief.jpg",
  },
];

export const SPECIES_TREATED: SpeciesItem[] = [
  {
    id: "dogs",
    name: "Dogs & Canines",
    description: "Comprehensive healthcare, vaccinations, orthopedic surgery, and emergency care for all breeds.",
    image: "/images/species-dogs-canine.jpg",
  },
  {
    id: "cats",
    name: "Cats & Felines",
    description: "Dedicated cat OPD suites, stress-free handling, vaccination schedules, and internal medicine.",
    image: "/images/service-feline-cat-care.jpg",
  },
  {
    id: "birds",
    name: "Birds & Parrots",
    description: "Avian medicine, beak trimming, feather care, and specialized diagnostics for pet birds.",
    image: "/images/species-birds-avian.jpg",
  },
  {
    id: "rabbits",
    name: "Rabbits & Small Herbivores",
    description: "Dental care, GI stasis management, dietary counseling, and gentle wellness checkups.",
    image: "/images/species-rabbits.jpg",
  },
  {
    id: "guinea-pigs",
    name: "Guinea Pigs & Hamsters",
    description: "Specialized small mammal care, skin treatments, nutritional balance, and respiratory care.",
    image: "/images/species-guinea-pigs-hamsters.jpg",
  },
  {
    id: "exotics",
    name: "Exotic Animals & Turtles",
    description: "Shell treatments, temperature-regulated care, reptile medicine, and specialized dietary guidance.",
    image: "/images/species-exotic-turtles-reptiles.jpg",
  },
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: "chitresh",
    author: "Chitresh Mittal",
    pet: "Pet Parent to Kuchi",
    review:
      "Thanks to AVC Hospital and Dr. Hardeep for helping my Kuchi. Over the past year, his accurate diagnoses and treatments have cured her problems. The staff are compassionate pet lovers, and the clinic is clean and well-maintained. I highly recommend Dr. Hardeep and AVC to all pet owners.",
    avatar: "/images/testimonial-client-chitresh-mittal.png",
  },
  {
    id: "gopa",
    author: "Gopa Ghoshal",
    pet: "Pet Parent to Rambo & Alex",
    review:
      "AVC PET Boarding is a second home for my pets, Rambo and Alex. We’re so relaxed having it next to our society. They’re always excited to meet their buddies Gullack, Simha, and Junior there. Thanks to the AVC team for taking great care of my boys. Highly recommended for pet parents looking for boarding and daycare!",
    avatar: "/images/testimonial-client-gopa-ghosal.png",
  },
  {
    id: "sonu",
    author: "Sonu Balu",
    pet: "Verified Pet Parent",
    review:
      "Animates Vet Care (AVC) Hospital in Gurugram offers exceptional multispecialty pet care, thanks to Dr. Hardeep Beniwal’s expertise and compassion, providing peace of mind with well-maintained modern facilities and comprehensive round-the-clock emergency services.",
    avatar: "/images/testimonial-client-sonu-balu.png",
  },
];

export const FAQS: FaqItem[] = [
  {
    question: "Can I get a home check-up for my pet?",
    answer:
      "Absolutely. We offer convenient home check-up services to ensure your pet receives the necessary care in the comfort of your home. Contact us at +91 99900 70026 to schedule a home visit.",
  },
  {
    question: "Do you offer emergency services?",
    answer:
      "Yes, AVC Multispeciality Pet Care Hospital provides 24/7 emergency services. If your pet is in urgent need of trauma care or critical support, please call our emergency helpline (+91 99900 70026) immediately or bring them directly to our Sector 90 hospital.",
  },
  {
    question: "What should I bring to my pet's appointment?",
    answer:
      "Please bring your pet's vaccination cards, prior medical records, any current medications, and a list of symptoms or concerns you have noticed. This helps our veterinarians provide the most precise diagnosis and care.",
  },
  {
    question: "Do you offer boarding services for pets?",
    answer:
      "Yes, our dedicated AVC Pet World Luxury Pet Resort & Boarding Center in Sector 87 provides safe, hygienic, air-conditioned boarding with supervised playtimes, nutritious meals, and 24/7 veterinary oversight.",
  },
];
