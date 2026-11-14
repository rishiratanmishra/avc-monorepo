import React from "react";
import Link from "next/link";
import { Container } from "../../layout/container";
import { SERVICES_HERO_DATA } from "../../../constants/services-info";
import { HOSPITAL_INFO } from "../../../constants";
import { Phone, ArrowDown, Activity } from "lucide-react";
import styles from "./services-hero.module.css";

export const ServicesHero: React.FC = () => {
  return (
    <section className={styles.servicesHero} aria-labelledby="services-page-title">
      <Container>
        {/* Breadcrumb Navigation */}
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/" className={styles.breadcrumbLink}>
            Home
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>Services</span>
        </nav>

        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>Clinical Services · Gurugram</span>

          <h1 id="services-page-title" className={styles.title}>
            Clinical expertise,{" "}
            <span className={styles.highlightText}>unconditional care</span>
          </h1>

          <p className={styles.subtitle}>{SERVICES_HERO_DATA.subtitle}</p>

          <p className={styles.locationLine}>
            Sector 90 Hospital (Emergency &amp; Surgery) · Sector 87 Pet World (Resort &amp; Wellness)
          </p>

          {/* Action Row */}
          <div className={styles.actionRow}>
            <a
              href={`tel:${HOSPITAL_INFO.emergencyPhone.replace(/\s+/g, "")}`}
              className={styles.emergencyBtn}
            >
              <Phone size={16} aria-hidden="true" />
              <span>Call 24/7 emergency</span>
            </a>

            <Link href="#services-catalog" className={styles.secondaryBtn}>
              <ArrowDown size={15} aria-hidden="true" />
              <span>Browse services</span>
            </Link>

            <Link href="#triage-guide" className={styles.secondaryBtn}>
              <Activity size={15} aria-hidden="true" />
              <span>Symptom triage guide</span>
            </Link>
          </div>
        </div>

        {/* Stats Strip */}
        <div className={styles.statsStrip}>
          {SERVICES_HERO_DATA.stats.map((stat, idx) => (
            <div key={idx} className={styles.statCard}>
              <div className={styles.statValue}>{stat.value}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
