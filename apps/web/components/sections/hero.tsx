import React from "react";
import Image from "next/image";
import { Container } from "../layout/container";
import { Button } from "../ui/button";
import { HOSPITAL_INFO, HOSPITAL_STATS } from "../../constants";
import styles from "./hero.module.css";

const STAT_ICONS = ["🐾", "🩺", "🔬", "🏆"];

export const Hero: React.FC = () => {
  return (
    <section className={styles.hero}>
      <Container>
        <div className={styles.heroGrid}>
          {/* Left Column: Value Prop, Social Proof & Actions */}
          <div className={styles.leftCol}>
            <div className={styles.livePill}>
              <span className={styles.pulseDot} />
              <span>24/7 Emergency & Trauma Care Active in Gurugram</span>
            </div>

            <h1 className={styles.mainTitle}>
              Advanced Medical &amp; Emergency Care For Your{" "}
              <span className={styles.highlightText}>Beloved Pets</span>
            </h1>

            <p className={styles.subtitle}>
              &ldquo;{HOSPITAL_INFO.quote}&rdquo; — Full-spectrum veterinary hospital with
              sterile modular OTs, IDEXX diagnostic labs, and compassionate care by
              Dr. Hardeep Beniwal &amp; team in Sector 90 &amp; Sector 87.
            </p>

            {/* Social Proof Snippet */}
            <div className={styles.socialProofSnippet}>
              <div className={styles.avatarGroup}>
                <Image
                  src="/images/testimonial-client-chitresh-mittal.png"
                  alt="Chitresh Mittal"
                  width={34}
                  height={34}
                  className={styles.miniAvatar}
                />
                <Image
                  src="/images/testimonial-client-gopa-ghosal.png"
                  alt="Gopa Ghoshal"
                  width={34}
                  height={34}
                  className={styles.miniAvatar}
                />
                <Image
                  src="/images/testimonial-client-sonu-balu.png"
                  alt="Sonu Balu"
                  width={34}
                  height={34}
                  className={styles.miniAvatar}
                />
              </div>
              <div className={styles.socialProofText}>
                <div className={styles.stars}>★★★★★</div>
                <span className={styles.socialProofLabel}>
                  4.9/5 from 2,500+ Verified Pet Parents
                </span>
              </div>
            </div>

            {/* Dual Action CTAs */}
            <div className={styles.ctaWrapper}>
              <Button variant="primary" size="lg" href="#services">
                Book Consultation →
              </Button>
              <Button
                variant="emergency"
                size="lg"
                href={`tel:${HOSPITAL_INFO.emergencyPhone}`}
                isExternal
              >
                🚨 Emergency: {HOSPITAL_INFO.emergencyPhone}
              </Button>
            </div>

            {/* Quick Reassurance Checkmarks */}
            <div className={styles.trustList}>
              <span className={styles.trustItem}>
                <span className={styles.checkIcon}>✓</span> 24/7 Trauma Emergency
              </span>
              <span className={styles.trustItem}>
                <span className={styles.checkIcon}>✓</span> In-House IDEXX Labs
              </span>
              <span className={styles.trustItem}>
                <span className={styles.checkIcon}>✓</span> Sterile Modular OT
              </span>
            </div>
          </div>

          {/* Right Column: Visual Canvas & Floating Glass Cards */}
          <div className={styles.rightCol}>
            <div className={styles.visualCanvas}>
              <div className={styles.canvasGlow} />

              <Image
                src="/images/hero-dog-banner.png"
                alt="Happy pet dog companion - AVC Multispeciality Pet Hospital"
                width={560}
                height={500}
                priority
                className={styles.heroVisualImg}
              />

              {/* Floating Glassmorphic Card Top */}
              <div className={styles.floatingCardTop}>
                <div className={styles.floatingIcon}>🚨</div>
                <div>
                  <div className={styles.floatingTextTitle}>24/7 Emergency &amp; ICU</div>
                  <div className={styles.floatingTextSub}>Sector 90, Gurugram</div>
                </div>
              </div>

              {/* Floating Glassmorphic Card Bottom */}
              <div className={styles.floatingCardBottom}>
                <Image
                  src="/images/doctor-dr-hardeep-with-cat.jpg"
                  alt="Dr. Hardeep Beniwal"
                  width={46}
                  height={46}
                  className={styles.doctorAvatar}
                />
                <div>
                  <div className={styles.floatingTextTitle}>Dr. Hardeep Beniwal</div>
                  <div className={styles.floatingTextSub}>Senior Veterinary Surgeon • 12+ Yrs</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Feature & Stats Strip */}
        <div className={styles.statsStrip}>
          {HOSPITAL_STATS.map((stat, idx) => (
            <div key={stat.label} className={styles.statCard}>
              <div className={styles.statIconWrap}>
                {STAT_ICONS[idx % STAT_ICONS.length]}
              </div>
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
