"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Container } from "../../layout/container";
import { CORE_SERVICES, HOSPITAL_INFO } from "../../../constants";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import {
  Stethoscope,
  Activity,
  HeartPulse,
  Sparkles,
  Cat,
  PhoneCall,
  Check,
  Cpu,
} from "lucide-react";
import styles from "./services.module.css";

const CLINICAL_DEPARTMENTS = [
  {
    id: "internal-medicine",
    name: "Internal Medicine",
    icon: Stethoscope,
    tagline: "Chronic Illnesses, Organ Care & Viral Diagnostics",
    description:
      "Comprehensive investigation and inpatient treatment of complex systemic illnesses, organ failure, and viral infections under expert internal medicine specialists.",
    conditions: [
      {
        name: "Parvovirus & Gastroenteritis",
        detail: "Strict viral isolation ward, intensive fluid management, and real-time plasma therapy.",
      },
      {
        name: "Kidney Failure & Hemodialysis",
        detail: "Acute renal failure stabilization with in-house hemodialysis and electrolyte panels.",
      },
      {
        name: "Cardiology & Heart Murmurs",
        detail: "Congestive heart failure management with digital ECG and color Doppler echocardiography.",
      },
      {
        name: "Neurology & Spinal Disc Disease",
        detail: "Seizure protocols, IVDD hind-limb paralysis rehabilitation, and pain management.",
      },
    ],
    equipment: [
      "IDEXX Catalyst & ProCyte Lab",
      "In-House Hemodialysis Unit",
      "Color Doppler Ultrasound",
      "Digital High-Frequency X-Ray",
    ],
    ctaText: "Consult Internal Medicine Specialist",
    ctaLink: `tel:${HOSPITAL_INFO.emergencyPhone}`,
  },
  {
    id: "surgery-ortho",
    name: "Surgeries & Orthopedics",
    icon: Activity,
    tagline: "Fractures, Tumor Resection & Modular Operating Theaters",
    description:
      "Human-grade surgical suites with Sevoflurane inhalation anesthesia, multiparameter cardiac telemetry, and sterile positive-pressure airflow.",
    conditions: [
      {
        name: "Bone Fractures & Joint Luxations",
        detail: "Rigid internal fixation with dynamic compression plates and orthopedic pinning.",
      },
      {
        name: "Cruciate Ligament (ACL/CCL) Repair",
        detail: "Stifle joint stabilization surgery and targeted physical recovery protocols.",
      },
      {
        name: "Surgical Oncology & Tumor Removal",
        detail: "Accurate biopsy diagnostics, wide-margin tumor resection, and cancer staging.",
      },
      {
        name: "Emergency Soft-Tissue Procedures",
        detail: "Splenectomy, Pyometra emergency surgery, cystotomy bladder stone removal, and gastropexy.",
      },
    ],
    equipment: [
      "Positive-Pressure Modular OT",
      "Sevoflurane Inhalation Anesthesia",
      "Multiparameter Vital Telemetry",
      "Bipolar Electrocautery Unit",
    ],
    ctaText: "Consult Veterinary Surgeon",
    ctaLink: `tel:${HOSPITAL_INFO.emergencyPhone}`,
  },
  {
    id: "emergency-trauma",
    name: "24/7 Trauma & Emergency",
    icon: HeartPulse,
    tagline: "Accidents, Toxicity, Shock & Resuscitation",
    description:
      "Stationed emergency veterinary surgeons and critical care nurses physically present at Sector 90 around the clock. Zero transit wait time.",
    conditions: [
      {
        name: "Road Traffic Accidents & Trauma",
        detail: "Hypovolemic shock resuscitation, internal bleeding stabilization, and acute wound repair.",
      },
      {
        name: "Poisoning & Toxic Ingestion",
        detail: "Emergency gastric lavage, targeted antidote administration, and ICU organ monitoring.",
      },
      {
        name: "Respiratory Distress & Heatstroke",
        detail: "Pressurized oxygen cages, active cooling therapy, and nebulized bronchodilation.",
      },
      {
        name: "Severe Anemia & Blood Transfusions",
        detail: "Canine and feline whole blood and packed red blood cell (PRBC) emergency transfusions.",
      },
    ],
    equipment: [
      "Pressurized Oxygen ICU Cages",
      "Blood Transfusion Suite",
      "Emergency FAST Ultrasound",
      "Defibrillator & Emergency Telemetry",
    ],
    ctaText: "Call 24/7 Emergency ICU",
    ctaLink: `tel:${HOSPITAL_INFO.emergencyPhone}`,
  },
  {
    id: "dermatology-dental",
    name: "Dermatology & Dental",
    icon: Sparkles,
    tagline: "Allergies, Skin Mange, Ear Infections & Oral Surgery",
    description:
      "Targeted diagnosis and therapeutic relief for persistent pruritus, allergic dermatitis, chronic ear infections, and advanced periodontal care.",
    conditions: [
      {
        name: "Chronic Skin Allergies & Atopy",
        detail: "Intradermal allergy diagnostics, cytopoint/apoquel protocols, and immunotherapy.",
      },
      {
        name: "Mange, Hot-Spots & Fungal Infections",
        detail: "Microscopic skin scrapings, medicated therapeutic baths, and targeted antimicrobials.",
      },
      {
        name: "Chronic Otitis (Ear Infections)",
        detail: "Video otoscopic examination, deep suction flushing, and culture-guided antibiotic relief.",
      },
      {
        name: "Periodontal Disease & Dental Tartar",
        detail: "Ultrasonic dental scaling, subgingival curettage, and surgical extractions under gas anesthesia.",
      },
    ],
    equipment: [
      "Ultrasonic Dental Scaler & Polisher",
      "Diagnostic Wood's Lamp & Scraping Lab",
      "High-Resolution Video Otoscope",
      "Medicated Therapeutic Spa",
    ],
    ctaText: "Book Dermatology / Dental OPD",
    ctaLink: `tel:${HOSPITAL_INFO.emergencyPhone}`,
  },
  {
    id: "feline-exotics",
    name: "Cat & Exotic Pets",
    icon: Cat,
    tagline: "Quiet Cat Care, Avian, Rabbits & Small Mammals",
    description:
      "Acoustically sound-isolated consultation rooms with synthetic feline pheromones, along with specialized exotic avian and small mammal pathology.",
    conditions: [
      {
        name: "Feline Urinary Obstruction (FLUTD)",
        detail: "Gentle sedation, urethral unblocking catheterization, and prescription urinary diet.",
      },
      {
        name: "Feline Viral Screenings (FIV / FeLV / FIP)",
        detail: "Rapid point-of-care antibody/antigen testing and low-stress inpatient care.",
      },
      {
        name: "Avian Wing & Respiratory Infections",
        detail: "Micro-aerosol nebulization, beak trimming, and specialized avian pharmacology.",
      },
      {
        name: "Rabbits & Pocket Pets (Guinea Pigs)",
        detail: "Dental spur burring, GI stasis management, and herbivore recovery nutrition.",
      },
    ],
    equipment: [
      "Feliway® Pheromone Diffusers",
      "Acoustically Isolated Cat OPD",
      "Precision Exotic Gram Scales",
      "Avian Micro-Mask Gas Anesthesia",
    ],
    ctaText: "Consult Cat & Exotic Specialist",
    ctaLink: `tel:${HOSPITAL_INFO.emergencyPhone}`,
  },
];

export const Services: React.FC = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeDept, setActiveDept] = useState(0);

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 398; // card width (370px) + gap (28px)
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const currentDept = (CLINICAL_DEPARTMENTS[activeDept] ??
    CLINICAL_DEPARTMENTS[0]) as (typeof CLINICAL_DEPARTMENTS)[number];

  return (
    <section className={styles.section} id="services">
      <Container>
        {/* Header with Title and Carousel Controls */}
        <div className={styles.topRow}>
          <div className={styles.titleArea}>
            <span className={styles.eyebrow}>COMPREHENSIVE CLINICAL CARE</span>
            <h2 className={styles.title}>Advanced Veterinary Services</h2>
          </div>

          <div className={styles.controls}>
            <button
              type="button"
              className={styles.controlBtn}
              onClick={() => scroll("left")}
              aria-label="Previous service"
            >
              <ChevronLeftIcon style={{ width: 18, height: 18 }} aria-hidden="true" />
            </button>
            <button
              type="button"
              className={styles.controlBtn}
              onClick={() => scroll("right")}
              aria-label="Next service"
            >
              <ChevronRightIcon style={{ width: 18, height: 18 }} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Carousel Track with Image Cards */}
        <div className={styles.carousel} ref={carouselRef}>
          {CORE_SERVICES.map((service) => (
            <div key={service.id} className={styles.card}>
              <div className={styles.cardVisual}>
                {service.image && (
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 768px) 290px, 370px"
                    className={styles.cardImage}
                  />
                )}
                <div className={styles.cardGradient} />
              </div>

              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{service.title}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* ------------------------------------------------------------------
            CLINICAL SPECIALTIES & CONDITIONS TREATED DIRECTORY
            ------------------------------------------------------------------ */}
        <div className={styles.clinicalDirectory}>
          <div className={styles.directoryHeader}>
            <div className={styles.directoryTitleGroup}>
              <span className={styles.directoryEyebrow}>Conditions &amp; specialties treated</span>
              <h3 className={styles.directoryTitle}>
                What Medical Conditions Does AVC Treat?
              </h3>
              <p className={styles.directorySubtitle}>
                Choose a department to see conditions treated, procedures, and available equipment.
              </p>
            </div>
          </div>

          {/* Department Tabs */}
          <div className={styles.deptTabsRow} role="tablist">
            {CLINICAL_DEPARTMENTS.map((dept, idx) => {
              const isActive = activeDept === idx;
              const Icon = dept.icon;
              return (
                <button
                  key={dept.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveDept(idx)}
                  className={`${styles.deptTabBtn} ${isActive ? styles.deptTabBtnActive : ""}`}
                >
                  <Icon size={16} aria-hidden="true" className={styles.deptTabIcon} />
                  <span>{dept.name}</span>
                </button>
              );
            })}
          </div>

          {/* Active Department Details Card */}
          <div className={styles.deptCard}>
            {/* Left Side: Specific Conditions Treated */}
            <div className={styles.conditionsCol}>
              <div className={styles.deptTaglineRow}>
                <span className={styles.deptTagline}>{currentDept.tagline}</span>
              </div>
              <p className={styles.deptDesc}>{currentDept.description}</p>

              <h4 className={styles.conditionsHeading}>Common Conditions &amp; Illnesses Treated:</h4>
              <div className={styles.conditionsGrid}>
                {currentDept.conditions.map((item) => (
                  <div key={item.name} className={styles.conditionItem}>
                    <div className={styles.conditionCheck} aria-hidden="true">
                      <Check size={13} strokeWidth={2.5} />
                    </div>
                    <div className={styles.conditionText}>
                      <strong className={styles.conditionName}>{item.name}</strong>
                      <p className={styles.conditionDetail}>{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side: Hospital Equipment & Direct CTA */}
            <div className={styles.equipmentCol}>
              <div className={styles.equipmentBox}>
                <div className={styles.equipmentBoxHeader}>
                  <Cpu size={16} className={styles.equipIcon} aria-hidden="true" />
                  <h4 className={styles.equipmentTitle}>In-House Clinical Infrastructure:</h4>
                </div>
                <ul className={styles.equipmentList}>
                  {currentDept.equipment.map((eq) => (
                    <li key={eq} className={styles.equipmentItem}>
                      <span className={styles.bulletDot} aria-hidden="true" />
                      <span>{eq}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.deptActionBox}>
                <span className={styles.deptHospitalNote}>
                  Sector 90 Hospital • Experienced Veterinary Doctors on Duty
                </span>
                <a href={currentDept.ctaLink} className={styles.deptCtaBtn}>
                  <PhoneCall size={15} aria-hidden="true" />
                  <span>{currentDept.ctaText}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
