"use client";

import React, { useState } from "react";
import { Container } from "../../layout/container";
import { Plus, Minus, PhoneCall } from "lucide-react";
import { HOSPITAL_INFO } from "../../../constants";
import styles from "./faq.module.css";

const FAQ_ITEMS = [
  {
    question: "Can I bring my pet in for an emergency without an appointment?",
    answer:
      "Yes. Walk-ins are accepted at the Sector 90 hospital, where emergency staff are on site 24/7. For urgent cases, call +91 99900 70026 before you arrive.",
  },
  {
    question: "How long do in-house lab tests take?",
    answer:
      "The in-house IDEXX lab can return hemogram, biochemistry, and electrolyte results in about 15 minutes. X-rays and ultrasound are reviewed during your consultation.",
  },
  {
    question: "How are pets monitored during surgery?",
    answer:
      "Pets receive pre-anesthetic blood tests, and the team monitors ECG, oxygen saturation, ETCO2, and blood pressure during surgery. Your veterinarian can explain the risks and options for your pet.",
  },
  {
    question: "Do you offer home visits?",
    answer:
      "Home visits are available in Gurgaon for routine checkups, vaccinations, and post-op follow-ups. Call +91 99900 70026 to arrange a visit.",
  },
  {
    question: "Where is boarding, and what does it include?",
    answer:
      "AVC Pet World is in Sector 87. Boarding includes air-conditioned rooms, supervised outdoor play, and personalized meals, with veterinary oversight.",
  },
  {
    question: "Do you have a separate consultation space for cats?",
    answer:
      "Yes. Cats can be seen in a dog-free consultation suite with sound dampening and Feliway® pheromone diffusers.",
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
          <div className={styles.leftCol}>
            <div className={styles.headerGroup}>
              <h2 className={styles.title}>Frequently asked questions</h2>
              <p className={styles.subtitle}>
                Answers about emergency visits, diagnostics, home visits, and boarding.
              </p>
            </div>

            <div className={styles.supportCard}>
              <h3 className={styles.supportTitle}>Need urgent help?</h3>
              <p className={styles.supportDesc}>
                Call the Sector 90 hospital for emergency care. Staff are on site 24/7.
              </p>

              <a
                href={`tel:${HOSPITAL_INFO.emergencyPhone.replace(/\s+/g, "")}`}
                className={styles.callSupportBtn}
              >
                <PhoneCall size={14} aria-hidden="true" />
                <span>Call hospital · {HOSPITAL_INFO.emergencyPhone}</span>
              </a>
            </div>
          </div>

          <div className={styles.rightCol}>
            <div className={styles.accordion}>
              {FAQ_ITEMS.map((item, index) => {
                const isOpen = openIndex === index;
                return (
                  <div
                    key={item.question}
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
