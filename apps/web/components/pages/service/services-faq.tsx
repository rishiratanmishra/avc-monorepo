"use client";

import React, { useState } from "react";
import { Container } from "../../layout/container";
import { SERVICES_FAQS } from "../../../constants/services-info";
import { HOSPITAL_INFO } from "../../../constants";
import { Plus, Minus, PhoneCall } from "lucide-react";
import styles from "./services-faq.module.css";

export const ServicesFaq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className={styles.section} id="services-faq" aria-labelledby="faq-title">
      <Container>
        <div className={styles.layoutGrid}>
          {/* Left Column: Title & 24/7 Helpline Card */}
          <div className={styles.leftCol}>
            <div className={styles.headerGroup}>
              <span className={styles.eyebrow}>Services FAQ</span>
              <h2 id="faq-title" className={styles.title}>
                Frequently asked questions
              </h2>
              <p className={styles.subtitle}>
                Clear answers regarding emergency admissions, surgical preparation, laboratory turnaround, and post-op care.
              </p>
            </div>

            <div className={styles.supportCard}>
              <h3 className={styles.supportTitle}>Have a specific clinical question?</h3>
              <p className={styles.supportDesc}>
                Our veterinary desk at Sector 90 is available 24/7 to guide you on urgent cases, triage, and surgeon availability.
              </p>
              <a
                href={`tel:${HOSPITAL_INFO.emergencyPhone.replace(/\s+/g, "")}`}
                className={styles.callSupportBtn}
              >
                <PhoneCall size={14} aria-hidden="true" />
                <span>Call 24/7 · {HOSPITAL_INFO.emergencyPhone}</span>
              </a>
            </div>
          </div>

          {/* Right Column: Clean Accordion */}
          <div className={styles.rightCol}>
            <div className={styles.accordion}>
              {SERVICES_FAQS.map((faq, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <div
                    key={faq.question}
                    className={`${styles.accordionItem} ${isOpen ? styles.itemOpen : ""}`}
                  >
                    <button
                      type="button"
                      className={styles.triggerBtn}
                      onClick={() => toggleItem(idx)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${idx}`}
                      id={`faq-question-${idx}`}
                    >
                      <span className={styles.questionText}>{faq.question}</span>
                      <span className={styles.iconCircle} aria-hidden="true">
                        {isOpen ? <Minus size={15} /> : <Plus size={15} />}
                      </span>
                    </button>

                    <div
                      id={`faq-answer-${idx}`}
                      role="region"
                      aria-labelledby={`faq-question-${idx}`}
                      className={`${styles.answerContent} ${isOpen ? styles.answerOpen : ""}`}
                    >
                      <p className={styles.answerText}>{faq.answer}</p>
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
