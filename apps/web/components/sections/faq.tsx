"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Container } from "../layout/container";
import { FAQS } from "../../constants";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import { PawPrint } from "lucide-react";
import styles from "./faq.module.css";

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className={styles.section} id="faq">
      <Container>
        <div className={styles.layoutGrid}>
          {/* Left Column: Team Photo & Experience Badge */}
          <div className={styles.visualCol}>
            <div className={styles.imageFrame}>
              <Image
                src="/images/team-veterinary-staff.jpg"
                alt="AVC Veterinary Doctors and Medical Care Staff Team"
                width={640}
                height={480}
                className={styles.teamImage}
              />
              <div className={styles.accentBadge}>
                <span className={styles.accentNum}>15+</span>
                <span className={styles.accentLabel}>
                  Years of Dedicated Care
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Section Header & Accordion List */}
          <div className={styles.contentCol}>
            <div className={styles.pill}>
              <PawPrint size={14} className={styles.pawIcon} aria-hidden="true" />
              <span>WHY CHOOSE AVC</span>
            </div>

            <h2 className={styles.title}>
              Compassionate, Full-Spectrum Care for Every Pet
            </h2>

            <p className={styles.subtitle}>
              From routine wellness and digital pathology to 24/7 trauma response, here are quick answers to the most common questions pet parents ask us.
            </p>

            <div className={styles.accordion}>
              {FAQS.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <div
                    key={index}
                    className={`${styles.accordionItem} ${
                      isOpen ? styles.itemOpen : ""
                    }`}
                  >
                    <button
                      type="button"
                      className={styles.triggerBtn}
                      onClick={() => toggleItem(index)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${index}`}
                      id={`faq-question-${index}`}
                    >
                      <span className={styles.questionText}>
                        {faq.question}
                      </span>
                      <span className={styles.iconCircle} aria-hidden="true">
                        {isOpen ? (
                          <MinusIcon style={{ width: 14, height: 14 }} />
                        ) : (
                          <PlusIcon style={{ width: 14, height: 14 }} />
                        )}
                      </span>
                    </button>

                    <div
                      id={`faq-answer-${index}`}
                      role="region"
                      aria-labelledby={`faq-question-${index}`}
                      className={`${styles.contentWrapper} ${
                        isOpen ? styles.expanded : styles.collapsed
                      }`}
                    >
                      <div className={styles.innerContent}>
                        <p className={styles.answerText}>{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
