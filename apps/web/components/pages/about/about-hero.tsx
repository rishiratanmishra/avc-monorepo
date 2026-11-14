import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "../../layout/container";
import { ABOUT_HERO_DATA } from "../../../constants/about-info";
import { HOSPITAL_INFO } from "../../../constants";
import { Phone, Calendar, ShieldCheck, HeartHandshake, MapPin } from "lucide-react";
import styles from "./about-hero.module.css";

export const AboutHero: React.FC = () => {
  return (
    <section className={styles.aboutHero} aria-labelledby="about-page-title">
      <div className={styles.backgroundGlow} aria-hidden="true" />
      <Container>
        {/* Breadcrumb Navigation */}
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/" className={styles.breadcrumbLink}>Home</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>About Us</span>
        </nav>

        <div className={styles.heroGrid}>
          {/* Left Column: Narrative & Trust Signals */}
          <div className={styles.contentCol}>
            <div className={styles.badgeRow}>
              <span className={styles.badge}>
                <ShieldCheck className={styles.badgeIcon} size={16} />
                {ABOUT_HERO_DATA.badge}
              </span>
              <span className={styles.badgeSecondary}>
                <MapPin className={styles.badgeIcon} size={15} />
                Sector 90 & Sector 87, Gurugram
              </span>
            </div>

            <h1 id="about-page-title" className={styles.title}>
              Compassionate Healing, <span className={styles.highlightText}>Advanced Veterinary Precision</span>
            </h1>

            <p className={styles.subtitle}>
              {ABOUT_HERO_DATA.subtitle}
            </p>

            {/* Inspiring Motto Block */}
            <div className={styles.mottoCard}>
              <HeartHandshake className={styles.mottoIcon} size={24} />
              <blockquote className={styles.mottoQuote}>
                {ABOUT_HERO_DATA.motto}
              </blockquote>
            </div>

            {/* Action Buttons */}
            <div className={styles.actionRow}>
              <a
                href={`tel:${HOSPITAL_INFO.emergencyPhone.replace(/\s+/g, "")}`}
                className={styles.emergencyBtn}
              >
                <Phone size={18} />
                <span>Call Emergency ICU (24/7)</span>
              </a>

              <Link href="/#contact" className={styles.appointmentBtn}>
                <Calendar size={18} />
                <span>Book Consultation</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Feature Card with Cutout */}
          <div className={styles.visualCol}>
            <div className={styles.imageCard}>
              <div className={styles.imageWrapper}>
                <Image
                  src="/images/doctor-hardeep-hero.png"
                  alt="Dr. Hardeep Beniwal - Founder and Chief Veterinary Surgeon at AVC Pet Hospital"
                  width={600}
                  height={620}
                  priority
                  className={styles.heroImage}
                />
              </div>

              {/* Floating Stat Callouts */}
              <div className={styles.floatingTagTop}>
                <span className={styles.tagDot} />
                <span>Emergency Trauma Ready 24/7</span>
              </div>

              <div className={styles.floatingCardBottom}>
                <div className={styles.doctorBadge}>
                  <div className={styles.doctorAvatar}>
                    <Image
                      src="/images/doctor-dr-hardeep-with-cat.jpg"
                      alt="Dr. Hardeep Beniwal with cat"
                      width={48}
                      height={48}
                      className={styles.avatarImg}
                    />
                  </div>
                  <div>
                    <strong className={styles.doctorName}>Dr. Hardeep Beniwal</strong>
                    <p className={styles.doctorTitle}>B.V.Sc & A.H., M.I.S.V.S. · Chief Surgeon</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Highlight Stats Bar */}
        <div className={styles.statsBar}>
          {ABOUT_HERO_DATA.stats.map((stat, idx) => (
            <div key={idx} className={styles.statItem}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
