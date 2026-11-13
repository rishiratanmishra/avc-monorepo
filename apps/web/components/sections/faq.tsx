"use client";

import React, { useState } from "react";
import { Container } from "../layout/container";
import { Plus, Minus, PhoneCall, HelpCircle, MapPin, Clock } from "lucide-react";
import { HOSPITAL_INFO } from "../../constants";
import styles from "./faq.module.css";

const FAQ_ITEMS = [
  {
    question: "Do I need an appointment for emergency care, or can I walk in?",
    answer:
      "Emergency cases and trauma never require an appointment. Our Sector 90 Trauma ICU has emergency veterinary surgeons and critical care nurses physically on-site 24/7/365. You can walk in directly anytime, or call our emergency helpline (+91 99900 70026) so our medical team preps oxygen and resuscitation before you arrive.",
  },
  {
    question: "How long do in-house lab reports and diagnostics take?",
    answer:
      "Our in-house IDEXX Catalyst & ProCyte laboratory delivers complete hemograms, biochemistry, and electrolyte reports in just 15 minutes. High-frequency digital X-rays and color Doppler ultrasound results are reviewed immediately with you during your consultation.",
  },
  {
    question: "Is anesthesia safe for senior or high-risk pets?",
    answer:
      "Yes. We use human-grade Sevoflurane inhalation gas anesthesia, which allows precise depth control and gentle, rapid post-op recovery. Every pet undergoes pre-anesthetic blood profiling, and vital parameters (ECG, SpO2, EtCO2, blood pressure) are continuously tracked on multiparameter monitors throughout surgery.",
  },
  {
    question: "Do you provide home veterinary check-ups in Gurgaon?",
    answer:
      "Yes, we provide home visit consultations across Gurgaon for routine check-ups, vaccinations, and post-op follow-ups. Call our helpline at +91 99900 70026 to book a convenient home visit slot with an experienced veterinary doctor.",
  },
  {
    question: "Where is your pet boarding located, and what care is provided?",
    answer:
      "Our dedicated luxury boarding resort is located at Sector 87, Pet World. It features clean, air-conditioned private rooms, supervised daily outdoor play, personalized nutrition plans, and round-the-clock veterinary oversight by our hospital team.",
  },
  {
    question: "Do you have a separate waiting area or OPD for cats?",
    answer:
      "Yes. We have dedicated, dog-free feline consultation suites with acoustic sound dampening and continuous Feliway® synthetic facial pheromone diffusers to ensure your cat has a calm, stress-free clinical experience away from barking dogs.",
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className={styles.section} id="faq">
      <Container>
        <div className={styles.layoutGrid}>
          {/* Left Column: Editorial Header & 24/7 Contact Card */}
          <div className={styles.leftCol}>
            <div className={styles.headerGroup}>
              <div className={styles.eyebrowPill}>
                <HelpCircle size={13} className={styles.pillIcon} aria-hidden="true" />
                <span>FREQUENTLY ASKED QUESTIONS</span>
              </div>
              <h2 className={styles.title}>
                Got questions? We&apos;re here to help, 24/7.
              </h2>
              <p className={styles.subtitle}>
                Everything you need to know about emergency walk-ins, 15-minute diagnostic results, surgeries, and pet care at AVC Hospital.
              </p>
            </div>

            {/* 24/7 Quick Contact & Support Card */}
            <div className={styles.supportCard}>
              <h3 className={styles.supportTitle}>Still have questions?</h3>
              <p className={styles.supportDesc}>
                Our veterinary surgeons and coordinators are available round-the-clock to assist you with appointments, emergency triage, or pet care queries.
              </p>

              <div className={styles.supportMeta}>
                <div className={styles.metaRow}>
                  <Clock size={14} className={styles.metaIcon} aria-hidden="true" />
                  <span>24/7 Emergency ICU • Sector 90</span>
                </div>
                <div className={styles.metaRow}>
                  <MapPin size={14} className={styles.metaIcon} aria-hidden="true" />
                  <span>Sector 90 Hospital &amp; Sector 87 Pet World</span>
                </div>
              </div>

              <a href={`tel:${HOSPITAL_INFO.emergencyPhone}`} className={styles.callSupportBtn}>
                <PhoneCall size={14} aria-hidden="true" />
                <span>Call Helpline: {HOSPITAL_INFO.emergencyPhone}</span>
              </a>
            </div>
          </div>

          {/* Right Column: Clean Minimalist Accordion */}
          <div className={styles.rightCol}>
            <div className={styles.accordion}>
              {FAQ_ITEMS.map((item, index) => {
                const isOpen = openIndex === index;
                return (
                  <div
                    key={index}
                    className={`${styles.accordionItem} ${isOpen ? styles.itemOpen : ""}`}
                  >
                    <button
                      type="button"
                      className={styles.triggerBtn}
                      onClick={() => toggleItem(index)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${index}`}
                      id={`faq-question-${index}`}
                    >
                      <span className={styles.questionText}>{item.question}</span>
                      <span className={styles.iconCircle} aria-hidden="true">
                        {isOpen ? <Minus size={15} /> : <Plus size={15} />}
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
                        <p className={styles.answerText}>{item.answer}</p>
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
