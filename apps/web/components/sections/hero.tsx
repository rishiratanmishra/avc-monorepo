import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "../layout/container";
import { HOSPITAL_INFO } from "../../constants";
import styles from "./hero.module.css";

const CLINICAL_STATS = [
  { value: "24/7", label: "Emergency & Critical Care ICU", icon: "🚨" },
  { value: "4,200+", label: "Surgeries & Treatments Performed", icon: "🔬" },
  { value: "20+", label: "Veterinary Doctors & Nursing Staff", icon: "🩺" },
  { value: "12+ Yrs", label: "Veterinary Clinical Excellence", icon: "🏆" },
];

export const Hero: React.FC = () => {
  return (
    <section className={styles.hero} id="home">
      {/* Decorative Background Paw Watermarks */}
      <div className={styles.pawWatermark1} aria-hidden="true">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
          <ellipse cx="6" cy="7" rx="2" ry="3" />
          <ellipse cx="11" cy="5" rx="2" ry="3" />
          <ellipse cx="16" cy="6" rx="2" ry="3" />
          <ellipse cx="20" cy="9" rx="1.8" ry="2.6" />
          <path d="M12 10.5c-3.2 0-5.5 2.1-5.5 5 0 2.2 1.8 3.5 3.8 3.5 1.2 0 2.2-.6 3.4-.6 1.1 0 2.1.6 3.3.6 2 0 3.8-1.3 3.8-3.5 0-2.9-2.3-5-5-5z" />
        </svg>
      </div>
      <div className={styles.pawWatermark2} aria-hidden="true">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
          <ellipse cx="6" cy="7" rx="2" ry="3" />
          <ellipse cx="11" cy="5" rx="2" ry="3" />
          <ellipse cx="16" cy="6" rx="2" ry="3" />
          <ellipse cx="20" cy="9" rx="1.8" ry="2.6" />
          <path d="M12 10.5c-3.2 0-5.5 2.1-5.5 5 0 2.2 1.8 3.5 3.8 3.5 1.2 0 2.2-.6 3.4-.6 1.1 0 2.1.6 3.3.6 2 0 3.8-1.3 3.8-3.5 0-2.9-2.3-5-5-5z" />
        </svg>
      </div>
      <div className={styles.pawWatermark3} aria-hidden="true">
        <svg width="42" height="42" viewBox="0 0 24 24" fill="currentColor">
          <ellipse cx="6" cy="7" rx="2" ry="3" />
          <ellipse cx="11" cy="5" rx="2" ry="3" />
          <ellipse cx="16" cy="6" rx="2" ry="3" />
          <ellipse cx="20" cy="9" rx="1.8" ry="2.6" />
          <path d="M12 10.5c-3.2 0-5.5 2.1-5.5 5 0 2.2 1.8 3.5 3.8 3.5 1.2 0 2.2-.6 3.4-.6 1.1 0 2.1.6 3.3.6 2 0 3.8-1.3 3.8-3.5 0-2.9-2.3-5-5-5z" />
        </svg>
      </div>

      <Container>
        <div className={styles.heroGrid}>
          {/* Left Column: Two-Tone Typography & Rounded Pill CTAs */}
          <div className={styles.leftCol}>
            <div className={styles.categoryPill}>
              <span className={styles.liveIndicator} />
              <span>24/7 Multi-Speciality Pet Hospital • Sector 90 &amp; 87, Gurugram</span>
            </div>

            <h1 className={styles.mainTitle}>
              Tailored <span className={styles.accentRed}>Medical Care</span> for{" "}
              <span className={styles.accentOrange}>Every Pet</span> In Your Family.
            </h1>

            <p className={styles.subtitle}>
              We offer 24/7 emergency triage, sterile surgeries, in-house pathology, and personalized wellness plans
              to meet the unique needs of every dog, cat, bird, and exotic companion.
            </p>

            {/* Rounded Capsule CTAs matching reference */}
            <div className={styles.ctaRow}>
              <Link href="#services" className={styles.primaryPillBtn}>
                <span className={styles.btnIconCircle}>📅</span>
                <span>Book Consultation</span>
              </Link>

              <a
                href={`tel:${HOSPITAL_INFO.emergencyPhone}`}
                className={styles.secondaryPillBtn}
              >
                <span className={styles.emergencyIcon}>🚨</span>
                <span>24/7 Emergency: {HOSPITAL_INFO.emergencyPhone}</span>
              </a>
            </div>

            {/* Trust Reassurance Chips */}
            <div className={styles.trustBadges}>
              <div className={styles.trustItem}>
                <span className={styles.check}>✓</span> Walk-in Emergency Care
              </div>
              <div className={styles.trustItem}>
                <span className={styles.check}>✓</span> Sterile Modular OT
              </div>
              <div className={styles.trustItem}>
                <span className={styles.check}>✓</span> In-House IDEXX Labs
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

              {/* Subject Image (Dr. Hardeep Beniwal with pet companion) */}
              <div className={styles.subjectWrapper}>
                <Image
                  src="/images/doctor-dr-hardeep-with-cat.jpg"
                  alt="Senior Veterinary Surgeon Dr. Hardeep Beniwal with pet patient at AVC Pet Hospital"
                  width={420}
                  height={420}
                  priority
                  className={styles.subjectImg}
                />
              </div>

              {/* Floating Card: Doctor Credibility (Right Center) */}
              <div className={styles.floatingServiceCard}>
                <div className={styles.serviceIconWrap}>
                  <span className={styles.serviceIcon}>👨‍⚕️</span>
                </div>
                <div>
                  <h3 className={styles.serviceCardTitle}>Dr. Hardeep Beniwal</h3>
                  <p className={styles.serviceCardSub}>Senior Veterinary Surgeon • 12+ Yrs</p>
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
