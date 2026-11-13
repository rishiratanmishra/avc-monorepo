import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "../layout/container";
import { HOSPITAL_INFO } from "../../constants";
import {
  CalendarDaysIcon,
  PhoneIcon,
  ClockIcon,
  SparklesIcon,
  UserGroupIcon,
  TrophyIcon,
  CheckCircleIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/solid";
import { MapPinIcon, ShieldCheckIcon } from "@heroicons/react/20/solid";
import { PawPrint } from "lucide-react";
import styles from "./hero.module.css";

const CLINICAL_STATS = [
  {
    value: "24/7",
    label: "Emergency & Critical Care ICU",
    icon: <ClockIcon className={styles.statSvgIcon} aria-hidden="true" />,
  },
  {
    value: "4,200+",
    label: "Surgeries & Treatments Performed",
    icon: <SparklesIcon className={styles.statSvgIcon} aria-hidden="true" />,
  },
  {
    value: "20+",
    label: "Veterinary Doctors & Nursing Staff",
    icon: <UserGroupIcon className={styles.statSvgIcon} aria-hidden="true" />,
  },
  {
    value: "12+ Yrs",
    label: "Veterinary Clinical Excellence",
    icon: <TrophyIcon className={styles.statSvgIcon} aria-hidden="true" />,
  },
];

export const Hero: React.FC = () => {
  return (
    <section className={styles.hero} id="home">
      {/* Decorative Background Paw Watermarks */}
      <div className={styles.pawWatermark1} aria-hidden="true">
        <PawPrint size={46} strokeWidth={1.5} />
      </div>
      <div className={styles.pawWatermark2} aria-hidden="true">
        <PawPrint size={36} strokeWidth={1.5} />
      </div>
      <div className={styles.pawWatermark3} aria-hidden="true">
        <PawPrint size={42} strokeWidth={1.5} />
      </div>

      <Container>
        <div className={styles.heroGrid}>
          {/* Left Column: Two-Tone Typography & Rounded Pill CTAs */}
          <div className={styles.leftCol}>
            {/* Top Verification & Location Pill */}
            <div className={styles.categoryPill}>
              <span className={styles.pillBadge}>
                <ShieldCheckIcon className={styles.badgeSvg} aria-hidden="true" />
                24/7 ICU &amp; Emergency
              </span>
              <span className={styles.pillDivider}>•</span>
              <span className={styles.pillLocation}>
                <MapPinIcon className={styles.locationPinSvg} aria-hidden="true" />
                Sector 90 &amp; 87, Gurugram
              </span>
            </div>

            <h1 className={styles.mainTitle}>
              Tailored <span className={styles.accentPrimary}>Medical Care</span> for{" "}
              <span className={styles.accentSecondary}>Every Pet</span> In Your Family.
            </h1>

            <p className={styles.subtitle}>
              We offer 24/7 emergency triage, sterile surgeries, in-house pathology, and personalized wellness plans
              to meet the unique needs of every dog, cat, bird, and exotic companion.
            </p>

            {/* Rounded Capsule CTAs */}
            <div className={styles.ctaRow}>
              <Link href="#services" className={styles.primaryPillBtn}>
                <span className={styles.primaryIconWrap}>
                  <CalendarDaysIcon className={styles.btnIconSvg} aria-hidden="true" />
                </span>
                <span>Book Consultation</span>
              </Link>

              <a
                href={`tel:${HOSPITAL_INFO.emergencyPhone}`}
                className={styles.secondaryPillBtn}
              >
                <span className={styles.emergencyIconWrap}>
                  <PhoneIcon className={styles.emergencyIconSvg} aria-hidden="true" />
                </span>
                <span className={styles.emergencyLabel}>24/7 Emergency</span>
              </a>
            </div>

            {/* Trust Reassurance Chips */}
            <div className={styles.trustBadges}>
              <div className={styles.trustItem}>
                <CheckCircleIcon className={styles.checkSvg} aria-hidden="true" />
                <span>Walk-in Emergency Care</span>
              </div>
              <div className={styles.trustItem}>
                <CheckCircleIcon className={styles.checkSvg} aria-hidden="true" />
                <span>Sterile Modular OT</span>
              </div>
              <div className={styles.trustItem}>
                <CheckCircleIcon className={styles.checkSvg} aria-hidden="true" />
                <span>In-House IDEXX Labs</span>
              </div>
            </div>
          </div>

          {/* Right Column: Signature Concentric Halo Rings + Pet Subject + Floating Micro-Cards */}
          <div className={styles.rightCol}>
            <div className={styles.concentricStage}>
              {/* Concentric Circular Rings Backdrop */}
              <div className={styles.ringOuter}>
                <div className={styles.ringMiddle}>
                  <div className={styles.ringInner} />
                </div>
              </div>

              {/* Subject Cutout: Dr. Hardeep Beniwal waist-up portrait emerging from halo */}
              <div className={styles.subjectWrapper}>
                <Image
                  src="/images/doctor-hardeep-hero.png"
                  alt="Senior Veterinary Surgeon Dr. Hardeep Beniwal with cat patient at AVC Pet Hospital"
                  width={440}
                  height={420}
                  priority
                  className={styles.subjectImg}
                />
              </div>

              {/* Anchored Nameplate Card directly masking the lower body boundary */}
              <div className={styles.doctorNameplateCard}>
                <div className={styles.doctorBadgeIcon}>
                  <AcademicCapIcon className={styles.doctorBadgeSvg} aria-hidden="true" />
                </div>
                <div>
                  <h3 className={styles.doctorName}>Dr. Hardeep Beniwal</h3>
                  <p className={styles.doctorRole}>Senior Veterinary Surgeon • 12+ Yrs</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Feature & Key Stats Strip */}
        <div className={styles.statsStrip}>
          {CLINICAL_STATS.map((stat) => (
            <div key={stat.label} className={styles.statCard}>
              <div className={styles.statIconBadge}>{stat.icon}</div>
              <div>
                <div className={styles.statValue}>{stat.value}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
