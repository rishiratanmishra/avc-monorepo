"use client";

import React, { useState } from "react";
import { Container } from "../../layout/container";
import { ChevronDown } from "lucide-react";
import styles from "./contact-faq.module.css";

const CONTACT_FAQS = [
  {
    question: "Do I need an appointment for emergency care or trauma ICU admission?",
    answer:
      "No appointment is ever needed for emergencies. Our Sector 90 Intensive Care Unit is fully staffed 24 hours a day, 365 days a year with emergency veterinary surgeons and critical care nurses. You can walk in directly. If possible, call us at +91 99900 70026 while on your way so our team prepares the oxygen cages and emergency surgical cart.",
  },
  {
    question: "How do I reach the Sector 90 Hospital from Dwarka Expressway or NH-48?",
    answer:
      "AVC Multispeciality Pet Hospital is located on Badha-Hayatpur Road, right next to DLF Regal Garden in Sector 90, Gurugram. It is easily accessible within 10–12 minutes from Dwarka Expressway, Central Peripheral Road (CPR), and NH-48 via Kherki Daula and Vatika India Next.",
  },
  {
    question: "Is there dedicated parking for emergency pet transfer?",
    answer:
      "Yes. Both our Sector 90 Hospital and Sector 87 Pet World provide free dedicated parking lots directly in front of the facilities. Sector 90 features a flat-grade stretcher ramp for quick and safe transfer of injured or immobile pets.",
  },
  {
    question: "Can I request a veterinary doctor home visit or lab sample pickup in Gurugram?",
    answer:
      "Yes. AVC provides mobile home veterinary visits across Gurugram for routine health reviews, puppy/kitten vaccinations, and diagnostic blood/urine sample collection. Call +91 99900 70026 to schedule a doctor visit to your home.",
  },
  {
    question: "What are the check-in hours for boarding at AVC Pet World Sector 87?",
    answer:
      "Daycare drop-offs and pet resort boarding check-ins are conducted between 9:00 AM and 8:00 PM every day. For pets requiring medical boarding or post-surgery recovery oversight, admission can be coordinated through our 24/7 Sector 90 hospital desk at any hour.",
  },
];

export const ContactFaq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={styles.section} id="contact-faq" aria-labelledby="faq-heading">
      <Container>
        <div className={styles.header}>
          <span className={styles.eyebrow}>Frequently Asked Questions</span>

          <h2 id="faq-heading" className={styles.title}>
            Hospital Visits &amp; <span className={styles.titleHighlight}>Contact Help</span>
          </h2>

          <p className={styles.description}>
            Important information about reaching our Gurugram campuses, emergency walk-ins, and consultation procedures.
          </p>
        </div>

        <div className={styles.faqList}>
          {CONTACT_FAQS.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className={`${styles.faqItem} ${isOpen ? styles.faqItemOpen : ""}`}
              >
                <button
                  type="button"
                  className={styles.questionBtn}
                  onClick={() => toggleFaq(index)}
                  aria-expanded={isOpen}
                >
                  <span className={styles.questionText}>{faq.question}</span>
                  <ChevronDown
                    size={18}
                    className={`${styles.chevronIcon} ${isOpen ? styles.chevronRotated : ""}`}
                    aria-hidden="true"
                  />
                </button>

                {isOpen && (
                  <div className={styles.answerBox}>
                    <p className={styles.answerText}>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
