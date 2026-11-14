import React from "react";
import Link from "next/link";
import { Container } from "../../layout/container";
import { SERVICES_HERO_DATA } from "../../../constants/services-info";
import { Phone, Calendar, ShieldCheck, MapPin, Sparkles, Activity } from "lucide-react";
import styles from "./services-hero.module.css";

export const ServicesHero: React.FC = () => {
  return (
    <section className={styles.servicesHero} aria-labelledby="services-page-title">
      <div className={styles.backgroundGlow} aria-hidden="true" />
      <Container>
        {/* Breadcrumb Navigation */}
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/" className={styles.breadcrumbLink}>Home</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>Services</span>
        </nav>

        <div className={styles.heroContent}>
          <div className={styles.badgeRow}>
            <span className={styles.badgePrimary}>
              <ShieldCheck size={16} />
              <span>{SERVICES_HERO_DATA.badge}</span>
            </span>
            <span className={styles.badgeSecondary}>
              <MapPin size={14} />
              <span>Sector 90 Hospital & Sector 87 Resort</span>
            </span>
          </div>

          <h1 id="services-page-title" className={styles.title}>
            Clinical Expertise, <span className={styles.highlightText}>Unconditional Pet Care</span>
          </h1>

          <p className={styles.subtitle}>
            {SERVICES_HERO_DATA.subtitle}
          </p>

          {/* Quick Action Buttons */}
          <div className={styles.actionRow}>
            <a
              href={`tel:${SERVICES_HERO_DATA.emergencyPhone.replace(/\s+/g, "")}`}
              className={styles.emergencyBtn}
            >
              <Phone size={18} />
              <span>24/7 Emergency ICU Helpline</span>
            </a>

            <Link href="#triage-guide" className={styles.triageBtn}>
              <Activity size={18} />
              <span>Symptom Triage Guide</span>
            </Link>

            <Link href="/#contact" className={styles.appointmentBtn}>
              <Calendar size={18} />
              <span>Book Doctor OPD</span>
            </Link>
          </div>
        </div>

        {/* Highlight Stats Strip */}
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
