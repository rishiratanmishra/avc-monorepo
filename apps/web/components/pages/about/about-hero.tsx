import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "../../layout/container";
import { ABOUT_HERO_DATA } from "../../../constants/about-info";
import { HOSPITAL_INFO } from "../../../constants";
import { Phone } from "lucide-react";
import styles from "./about-hero.module.css";

export const AboutHero: React.FC = () => {
  return (
    <section className={styles.aboutHero} aria-labelledby="about-page-title">
      <Container>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/" className={styles.breadcrumbLink}>Home</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>About Us</span>
        </nav>

        <div className={styles.heroGrid}>
          <div className={styles.contentCol}>
            <span className={styles.eyebrow}>About AVC Pet Hospital</span>
            <h1 id="about-page-title" className={styles.title}>
              Multispeciality veterinary care{" "}
              <span className={styles.highlightText}>in Gurugram</span>
            </h1>

            <p className={styles.subtitle}>{ABOUT_HERO_DATA.subtitle}</p>
            <p className={styles.locationLine}>
              Sector 90 Hospital · Sector 87 Pet World
            </p>

            <div className={styles.actionRow}>
              <a
                href={`tel:${HOSPITAL_INFO.emergencyPhone.replace(/\s+/g, "")}`}
                className={styles.emergencyBtn}
              >
                <Phone size={16} aria-hidden="true" />
                <span>Call 24/7 emergency</span>
              </a>

              <Link href="#facilities" className={styles.appointmentBtn}>
                <span>View facilities</span>
              </Link>
            </div>
          </div>

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
              <div className={styles.doctorCaption}>
                <strong className={styles.doctorName}>Dr. Hardeep Beniwal</strong>
                <p className={styles.doctorTitle}>
                  Founder &amp; Chief Veterinary Surgeon
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
