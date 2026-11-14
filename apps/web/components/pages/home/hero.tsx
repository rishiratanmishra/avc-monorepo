import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "../../layout/container";
import { HOSPITAL_INFO } from "../../../constants";
import {
  CalendarDaysIcon,
  PhoneIcon,
  CheckCircleIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/solid";
import { MapPinIcon } from "@heroicons/react/20/solid";
import styles from "./hero.module.css";

const CLINICAL_STATS = [
  {
    value: "24/7",
    label: "Emergency & Critical Care ICU",
  },
  {
    value: "4,200+",
    label: "Surgeries & Treatments Performed",
  },
  {
    value: "20+",
    label: "Veterinary Doctors & Nursing Staff",
  },
  {
    value: "12+ Yrs",
    label: "Veterinary Clinical Excellence",
  },
];

export const Hero: React.FC = () => {
  return (
    <section className={styles.hero} id="home">
      <Container>
        <div className={styles.heroGrid}>
          <div className={styles.leftCol}>
            <div className={styles.categoryPill}>
              <span className={styles.pillBadge}>24/7 emergency care</span>
              <span className={styles.pillDivider} aria-hidden="true">·</span>
              <span className={styles.pillLocation}>
                <MapPinIcon className={styles.locationPinSvg} aria-hidden="true" />
                Sector 90, Gurugram
              </span>
            </div>

            <h1 className={styles.mainTitle}>
              Veterinary care for every pet in your family.
            </h1>

            <p className={styles.subtitle}>
              From routine checkups to emergency treatment, our Gurugram team cares for dogs, cats,
              birds, and exotic pets.
            </p>

            <div className={styles.ctaRow}>
              <Link href="#services" className={styles.primaryPillBtn}>
                <span className={styles.primaryIconWrap}>
                  <CalendarDaysIcon className={styles.btnIconSvg} aria-hidden="true" />
                </span>
                <span>View services</span>
              </Link>

              <a
                href={`tel:${HOSPITAL_INFO.emergencyPhone}`}
                className={styles.secondaryPillBtn}
              >
                <span className={styles.emergencyIconWrap}>
                  <PhoneIcon className={styles.emergencyIconSvg} aria-hidden="true" />
                </span>
                <span className={styles.emergencyLabel}>Call for emergencies</span>
              </a>
            </div>

            <div className={styles.trustBadges}>
              <div className={styles.trustItem}>
                <CheckCircleIcon className={styles.checkSvg} aria-hidden="true" />
                <span>Walk-ins welcome</span>
              </div>
              <div className={styles.trustItem}>
                <CheckCircleIcon className={styles.checkSvg} aria-hidden="true" />
                <span>In-house diagnostics</span>
              </div>
              <div className={styles.trustItem}>
                <CheckCircleIcon className={styles.checkSvg} aria-hidden="true" />
                <span>Surgical care</span>
              </div>
            </div>
          </div>

          <div className={styles.rightCol}>
            <div className={styles.concentricStage}>
              {/* Concentric Circular Rings Backdrop */}
              <div className={styles.ringOuter} aria-hidden="true">
                <div className={styles.ringMiddle}>
                  <div className={styles.ringInner} />
                </div>
              </div>

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

        <div className={styles.statsStrip}>
          {CLINICAL_STATS.map((stat) => (
            <div key={stat.label} className={styles.statCard}>
              <div className={styles.statValue}>{stat.value}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
