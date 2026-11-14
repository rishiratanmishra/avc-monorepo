import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "../../layout/container";
import { FOUNDER_DATA } from "../../../constants/about-info";
import { Award, CheckCircle, GraduationCap, ArrowRight, Stethoscope } from "lucide-react";
import styles from "./founder-story.module.css";

export const FounderStory: React.FC = () => {
  return (
    <section className={styles.section} id="founder-story" aria-labelledby="founder-title">
      <Container>
        <div className={styles.containerGrid}>
          {/* Left Column: Doctor Visual Presentation */}
          <div className={styles.visualCol}>
            <div className={styles.imageCard}>
              <div className={styles.imageBackdrop} aria-hidden="true" />
              <div className={styles.imageWrapper}>
                <Image
                  src={FOUNDER_DATA.image}
                  alt={`${FOUNDER_DATA.name} - ${FOUNDER_DATA.role}`}
                  width={520}
                  height={580}
                  className={styles.doctorImg}
                />
              </div>

              {/* Floating Credentials Pill */}
              <div className={styles.floatingExpBadge}>
                <Award className={styles.badgeIcon} size={22} />
                <div>
                  <strong className={styles.expNumber}>12+ Years</strong>
                  <span className={styles.expLabel}>Surgical Mastery</span>
                </div>
              </div>
            </div>

            {/* Quote Block */}
            <div className={styles.quoteCard}>
              <div className={styles.quoteHeader}>
                <span className={styles.quoteMark}>“</span>
                <p className={styles.quoteText}>{FOUNDER_DATA.quote}</p>
              </div>
              <div className={styles.quoteAuthor}>
                <strong>{FOUNDER_DATA.name}</strong>
                <span>{FOUNDER_DATA.degrees} · Founder</span>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative & Philosophy */}
          <div className={styles.contentCol}>
            <div className={styles.badge}>
              <Stethoscope size={15} />
              <span>Leadership & Clinical Vision</span>
            </div>

            <h2 id="founder-title" className={styles.name}>
              {FOUNDER_DATA.name}
            </h2>

            <div className={styles.qualificationsRow}>
              <span className={styles.degreePill}>
                <GraduationCap size={15} />
                {FOUNDER_DATA.degrees}
              </span>
              <span className={styles.roleText}>{FOUNDER_DATA.role}</span>
            </div>

            <div className={styles.storyText}>
              {FOUNDER_DATA.storyParagraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {/* Specialties Matrix */}
            <div className={styles.specialtiesBox}>
              <h3 className={styles.specialtiesTitle}>Areas of Clinical Focus</h3>
              <div className={styles.specialtiesGrid}>
                {FOUNDER_DATA.specialties.map((item, index) => (
                  <div key={index} className={styles.specialtyItem}>
                    <CheckCircle className={styles.checkIcon} size={16} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Booking Callout */}
            <div className={styles.ctaBox}>
              <div>
                <strong className={styles.ctaHeading}>Consult Dr. Hardeep Beniwal</strong>
                <p className={styles.ctaSub}>Available for complex surgeries, second opinions & routine OPD.</p>
              </div>
              <Link href="/#contact" className={styles.ctaBtn}>
                <span>Book Doctor</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
