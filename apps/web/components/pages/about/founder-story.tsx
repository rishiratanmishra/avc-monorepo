import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "../../layout/container";
import { FOUNDER_DATA } from "../../../constants/about-info";
import { ArrowRight, Check, GraduationCap } from "lucide-react";
import styles from "./founder-story.module.css";

export const FounderStory: React.FC = () => {
  return (
    <section className={styles.section} id="founder-story" aria-labelledby="founder-title">
      <Container>
        <div className={styles.containerGrid}>
          <div className={styles.visualCol}>
            <div className={styles.imageCard}>
              <div className={styles.imageWrapper}>
                <Image
                  src={FOUNDER_DATA.image}
                  alt={`${FOUNDER_DATA.name} - ${FOUNDER_DATA.role}`}
                  width={520}
                  height={580}
                  className={styles.doctorImg}
                />
              </div>
            </div>
          </div>

          <div className={styles.contentCol}>
            <span className={styles.eyebrow}>Founder</span>

            <h2 id="founder-title" className={styles.name}>
              {FOUNDER_DATA.name}
            </h2>

            <div className={styles.qualificationsRow}>
              <span className={styles.degreeText}>
                <GraduationCap size={15} aria-hidden="true" />
                {FOUNDER_DATA.degrees}
              </span>
              <span className={styles.roleText}>{FOUNDER_DATA.role}</span>
            </div>

            <div className={styles.storyText}>
              {FOUNDER_DATA.storyParagraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className={styles.specialtiesBox}>
              <h3 className={styles.specialtiesTitle}>Areas of Clinical Focus</h3>
              <div className={styles.specialtiesGrid}>
                {FOUNDER_DATA.specialties.map((item, index) => (
                  <div key={index} className={styles.specialtyItem}>
                    <Check className={styles.checkIcon} size={15} aria-hidden="true" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.ctaBox}>
              <div>
                <strong className={styles.ctaHeading}>Appointments and enquiries</strong>
                <p className={styles.ctaSub}>Contact the hospital to arrange a visit.</p>
              </div>
              <Link href="/#contact" className={styles.ctaBtn}>
                <span>Contact AVC</span>
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
