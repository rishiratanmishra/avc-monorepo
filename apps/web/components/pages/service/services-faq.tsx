"use client";

import React, { useState } from "react";
import { Container } from "../../layout/container";
import { SERVICES_FAQS } from "../../../constants/services-info";
import { Plus, Minus, HelpCircle, PhoneCall } from "lucide-react";
import styles from "./services-faq.module.css";

export const ServicesFaq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className={styles.section} id="services-faq" aria-labelledby="faq-title">
      <Container>
        <div className={styles.header}>
          <div className={styles.tagWrap}>
            <HelpCircle className={styles.tagIcon} size={16} />
            <span>Got Questions?</span>
          </div>

          <h2 id="faq-title" className={styles.title}>
            Frequently Asked Questions
          </h2>

          <p className={styles.description}>
            Have questions about emergency admissions, surgical prep, or laboratory report timelines? Here are clear answers to common inquiries.
          </p>
        </div>

        <div className={styles.faqList}>
          {SERVICES_FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`${styles.faqCard} ${isOpen ? styles.faqCardOpen : ""}`}
              >
                <button
                  type="button"
                  className={styles.questionBtn}
                  onClick={() => toggleItem(idx)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${idx}`}
                  id={`faq-question-${idx}`}
                >
                  <span className={styles.questionText}>{faq.question}</span>
                  <span className={styles.toggleIcon} aria-hidden="true">
                    {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                  </span>
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${idx}`}
                    role="region"
                    aria-labelledby={`faq-question-${idx}`}
                    className={styles.answerWrapper}
                  >
                    <p className={styles.answerText}>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Reassurance Callout Card */}
        <div className={styles.calloutCard}>
          <div>
            <strong className={styles.calloutHeading}>Still have a specific clinical question?</strong>
            <p className={styles.calloutSub}>Our veterinary desk is available 24/7 to guide you on urgent cases and appointment slots.</p>
          </div>
          <a href="tel:+919990070026" className={styles.calloutBtn}>
            <PhoneCall size={16} />
            <span>Call +91 99900 70026</span>
          </a>
        </div>
      </Container>
    </section>
  );
};
