import React from "react";
import Image from "next/image";
import { Container } from "../layout/container";
import { HOSPITAL_INFO } from "../../constants";
import {
  CalendarDaysIcon,
  AcademicCapIcon,
  ClipboardDocumentCheckIcon,
  HeartIcon,
  PhoneIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/solid";
import {
  PawPrint,
  Siren,
  Microscope,
  PhoneCall,
  MapPin,
  Footprints,
  ShieldAlert,
} from "lucide-react";
import styles from "./process.module.css";

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Make Appointment",
    description:
      "Schedule your visit online or call our 24/7 helpline for quick registration and priority slot booking.",
    image: "/images/process-step1-make-appointment.png",
    tag: "Priority Booking",
    icon: CalendarDaysIcon,
  },
  {
    step: "02",
    title: "Doctor Assigned",
    description:
      "An experienced veterinary specialist tailored to your pet's specific medical condition is assigned.",
    image: "/images/process-step2-doctor-assigned.jpg",
    tag: "Specialist Vet",
    icon: AcademicCapIcon,
  },
  {
    step: "03",
    title: "Get Consultation",
    description:
      "Comprehensive physical checkup, in-house diagnostics, digital radiography, and personalized care plan.",
    image: "/images/process-step3-consultation.png",
    tag: "In-House Diagnostics",
    icon: ClipboardDocumentCheckIcon,
  },
  {
    step: "04",
    title: "Get Cure & Relief",
    description:
      "Targeted treatment, gentle medication, follow-up monitoring, and quick recovery for your furry companion.",
    image: "/images/process-step4-cure-and-relief.jpg",
    tag: "Compassionate Recovery",
    icon: HeartIcon,
  },
];

export const PetCareProcess: React.FC = () => {
  return (
    <section className={styles.section} id="process">
      <Container>
        {/* Section Header */}
        <div className={styles.header}>
          <div className={styles.pill}>
            <PawPrint size={14} className={styles.pawIcon} aria-hidden="true" />
            <span>Care Journey &amp; Process</span>
          </div>

          <h2 className={styles.title}>
            Your Pet&apos;s <span className={styles.accentBrand}>Seamless Care Journey</span>
          </h2>

          <p className={styles.subtitle}>
            From booking your consultation to expert recovery, we ensure a warm, transparent,
            and compassionate experience at every step.
          </p>
        </div>

        {/* 4-Step Interactive Process Grid */}
        <div className={styles.grid}>
          {PROCESS_STEPS.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === PROCESS_STEPS.length - 1;

            return (
              <div key={step.step} className={styles.stepCardWrapper}>
                <div className={styles.stepCard}>
                  {/* Step Image with Floating Badges */}
                  <div className={styles.imageWrap}>
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className={styles.stepImage}
                    />
                    <div className={styles.imageOverlay} />

                    <div className={styles.stepBadgeRow}>
                      <span className={styles.stepNumberPill}>
                        <span>Step</span> {step.step}
                      </span>
                      <div className={styles.stepIconCircle}>
                        <Icon style={{ width: 16, height: 16 }} aria-hidden="true" />
                      </div>
                    </div>
                  </div>

                  {/* Step Text Content */}
                  <div className={styles.content}>
                    <div>
                      <h3 className={styles.stepTitle}>{step.title}</h3>
                      <p className={styles.stepDesc}>{step.description}</p>
                    </div>

                    <div className={styles.stepTag}>
                      <span>✓ {step.tag}</span>
                    </div>
                  </div>
                </div>

                {/* Connecting Desktop Arrow (hidden on last card) */}
                {!isLast && (
                  <div className={styles.connectorArrow} aria-hidden="true">
                    <ArrowRightIcon style={{ width: 14, height: 14 }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Fast-Track Emergency Bypass Callout with Pet Companion */}
        <div className={styles.emergencyBypassCard}>
          {/* Left: Transparent Dog Cutout */}
          <div className={styles.bypassPetSection}>
            <div className={styles.petImgContainer}>
              <Image
                src="/images/emergency-dog-companion.png"
                alt="Golden Retriever companion at AVC Pet Hospital"
                width={150}
                height={210}
                priority
                className={styles.bypassPetImg}
              />
            </div>
          </div>

          {/* Middle: Clinical Content & Feature Tiles */}
          <div className={styles.bypassContent}>
            {/* Eyebrow & Heartbeat Wave */}
            <div className={styles.eyebrowRow}>
              <span className={styles.eyebrowText}>Veterinary Emergency Care</span>
              <svg
                className={styles.ecgWave}
                viewBox="0 0 64 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M2 10 H14 L17.5 3.5 L22.5 16.5 L27.5 7 L31 12.5 L34.5 10 H62"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Title */}
            <h3 className={styles.bypassTitle}>Critical Trauma or Sudden Medical Emergency?</h3>

            {/* Description */}
            <p className={styles.bypassText}>
              Skip the routine queue. Bring your dog, cat, or exotic companion directly to our 24/7 Trauma ICU in Sector 90, Gurugram.
            </p>

            {/* 3 Clinical Feature Tiles */}
            <div className={styles.featureGrid}>
              <div className={styles.featureTile}>
                <div className={styles.featureIconWrap}>
                  <Siren size={18} strokeWidth={2.2} aria-hidden="true" />
                </div>
                <div className={styles.featureLabel}>
                  <span>Immediate</span>
                  <strong>Triage</strong>
                </div>
              </div>

              <div className={styles.featureTile}>
                <div className={styles.featureIconWrap}>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ width: 18, height: 18 }}
                    aria-hidden="true"
                  >
                    <path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8z" />
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                    <path d="M12 11v6" />
                    <path d="M9 14h6" />
                  </svg>
                </div>
                <div className={styles.featureLabel}>
                  <span>Oxygen</span>
                  <strong>ICU Cages</strong>
                </div>
              </div>

              <div className={styles.featureTile}>
                <div className={styles.featureIconWrap}>
                  <Microscope size={18} strokeWidth={2.2} aria-hidden="true" />
                </div>
                <div className={styles.featureLabel}>
                  <span>In-House</span>
                  <strong>Labs &amp; X-Ray</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Badges & Call Action Area */}
          <div className={styles.bypassActionCol}>
            {/* Top Right Badges */}
            <div className={styles.topBadgesRow}>
              <span className={styles.traumaPill}>
                <ShieldAlert size={13} strokeWidth={2.5} aria-hidden="true" />
                24/7 Trauma ICU &amp; Emergency
              </span>
              <span className={styles.walkinPill}>
                <Footprints size={13} strokeWidth={2.2} aria-hidden="true" />
                Walk-ins Welcome
              </span>
            </div>

            {/* Big Call Button in Brand Colors */}
            <a href={`tel:${HOSPITAL_INFO.emergencyPhone}`} className={styles.callCtaBtn}>
              <div className={styles.phoneIconWrap}>
                <PhoneCall size={20} strokeWidth={1.5} aria-hidden="true" />
              </div>
              <div className={styles.callBtnText}>
                <span className={styles.callBtnNumber}>{HOSPITAL_INFO.emergencyPhone}</span>
              </div>
            </a>

            {/* Location Chip */}
            <div className={styles.locationChip}>
              <MapPin size={13} strokeWidth={2.2} aria-hidden="true" style={{ flexShrink: 0 }} />
              <span>Sector 90 Hospital</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
