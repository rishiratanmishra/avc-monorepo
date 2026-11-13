"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Container } from "../layout/container";
import { ArrowRight, PhoneCall } from "lucide-react";
import { HOSPITAL_INFO } from "../../constants";
import styles from "./why-choose-us.module.css";

const CLINICAL_PROOFS = [
  {
    id: "icu",
    step: "01",
    title: "24/7 Emergency & Critical Care",
    description:
      "Round-the-clock emergency support, trauma management, and intensive care at Sector 90, Gurugram. Our doctors and ICU staff are physically present in the hospital 24/7 to attend to your pet immediately.",
    bullets: [
      "On-duty veterinarians and critical care staff available all night",
      "Immediate trauma, poisoning, and emergency triage with zero waiting",
      "Pressurized oxygen therapy and continuous cardiac monitoring",
    ],
    image: "/images/service-24-7-emergency-care.jpg",
    caption: "Sector 90 Hospital • 24/7 Emergency & Critical Care Unit",
    ctaText: "Call 24/7 Emergency",
    ctaLink: `tel:${HOSPITAL_INFO.emergencyPhone}`,
    isEmergency: true,
  },
  {
    id: "labs",
    step: "02",
    title: "In-House IDEXX Diagnostics",
    description:
      "State-of-the-art diagnostic testing inside our hospital. IDEXX analyzers deliver complete blood counts, organ profiles, and electrolyte reports in 15 minutes so treatment can begin without delay.",
    bullets: [
      "Complete hemogram and biochemistry reports in 15 minutes",
      "Comprehensive liver, kidney, and electrolyte testing on-site",
      "High-frequency digital X-ray and color Doppler ultrasound",
    ],
    image: "/images/service-diagnostic-lab-pathology.jpg",
    caption: "In-House Diagnostics • IDEXX Lab & Digital Imaging",
    ctaText: "View Diagnostic Services",
    ctaLink: "#services",
    isEmergency: false,
  },
  {
    id: "surgery",
    step: "03",
    title: "Modular Operation Theaters",
    description:
      "Modern positive-pressure surgical suites equipped with precision inhalation gas anesthesia and multiparameter vital monitoring for safe procedures and smooth recovery.",
    bullets: [
      "Human-grade Sevoflurane inhalation anesthesia for gentle recovery",
      "Real-time ECG, oxygen saturation, and blood pressure telemetry",
      "Orthopedic fracture repair, soft-tissue, and emergency surgeries",
    ],
    image: "/images/service-advanced-surgery-ot.jpg",
    caption: "Sterile Modular OT • Advanced Veterinary Surgery",
    ctaText: "Learn About Surgery",
    ctaLink: "#services",
    isEmergency: false,
  },
  {
    id: "feline",
    step: "04",
    title: "Dedicated Cat-Friendly Care",
    description:
      "A quiet, separate consultation space designed specifically for cats to avoid the stress and noise of barking dogs. Supported by calming pheromones and gentle, fear-free handling.",
    bullets: [
      "Quiet, acoustically separated rooms away from canine areas",
      "Natural feline calming pheromones to reduce hospital stress",
      "Gentle, cat-friendly handling by experienced veterinary team",
    ],
    image: "/images/service-feline-cat-care.jpg",
    caption: "Dedicated Cat Suite • Low-Stress Feline Care",
    ctaText: "Explore Cat Care",
    ctaLink: "#services",
    isEmergency: false,
  },
];

export const WhyChooseUs: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const containerHeight = rect.height - window.innerHeight;
      if (containerHeight <= 0) return;

      const scrolled = -rect.top;
      const progress = Math.min(Math.max(scrolled / containerHeight, 0), 1);
      const stepIndex = Math.min(
        Math.floor(progress * CLINICAL_PROOFS.length),
        CLINICAL_PROOFS.length - 1
      );
      setActiveStep(stepIndex);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToStep = (index: number) => {
    setActiveStep(index);
    if (!containerRef.current) return;
    const containerTop = containerRef.current.offsetTop;
    const containerHeight = containerRef.current.offsetHeight - window.innerHeight;
    const targetScroll = containerTop + (containerHeight / (CLINICAL_PROOFS.length - 1)) * index;
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  return (
    <section className={styles.section} id="why-choose-us" ref={containerRef}>
      <div className={styles.stickyViewport}>
        <Container>
          <div className={styles.grid}>
            {/* LEFT COLUMN: Pure Typography Vertical Menu & Simple Content */}
            <div className={styles.leftCol}>
              <div className={styles.header}>
                <span className={styles.eyebrow}>Why Choose AVC</span>
                <h2 className={styles.title}>
                  Everything your pet needs, all under one roof.
                </h2>
              </div>

              {/* Vertical Menu List */}
              <nav className={styles.verticalList} role="tablist">
                {CLINICAL_PROOFS.map((proof, idx) => {
                  const isActive = activeStep === idx;
                  return (
                    <div
                      key={proof.id}
                      className={`${styles.item} ${isActive ? styles.itemActive : ""}`}
                    >
                      <button
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => scrollToStep(idx)}
                        className={styles.itemHeader}
                      >
                        <span className={styles.itemStep}>{proof.step}</span>
                        <span className={styles.itemTitle}>{proof.title}</span>
                      </button>

                      {/* Active expanded simple details */}
                      {isActive && (
                        <div className={styles.itemBody}>
                          <p className={styles.itemDesc}>{proof.description}</p>

                          <ul className={styles.bulletList}>
                            {proof.bullets.map((b) => (
                              <li key={b} className={styles.bulletItem}>
                                <span className={styles.bulletDot} aria-hidden="true" />
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>

                          <div className={styles.ctaRow}>
                            <a href={proof.ctaLink} className={styles.ctaLink}>
                              <span>{proof.ctaText}</span>
                              {proof.isEmergency ? (
                                <PhoneCall size={14} aria-hidden="true" />
                              ) : (
                                <ArrowRight size={14} aria-hidden="true" />
                              )}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>

            {/* RIGHT COLUMN: Clean Single Photographic Frame */}
            <div className={styles.rightCol}>
              <div className={styles.photoFrame}>
                {CLINICAL_PROOFS.map((proof, idx) => {
                  const isActive = activeStep === idx;
                  return (
                    <div
                      key={proof.id}
                      className={`${styles.photoSlide} ${
                        isActive ? styles.photoSlideActive : ""
                      }`}
                      aria-hidden={!isActive}
                    >
                      <Image
                        src={proof.image}
                        alt={proof.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        priority={idx === 0}
                        className={styles.photoImg}
                      />
                      <div className={styles.photoScrim} />
                      <div className={styles.captionTag}>
                        <span>{proof.caption}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
};
