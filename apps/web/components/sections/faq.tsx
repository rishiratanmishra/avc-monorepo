import React from "react";
import { Container } from "../layout/container";
import { Badge } from "../ui/badge";
import { FAQS } from "../../constants";
import styles from "./faq.module.css";

export const FaqSection: React.FC = () => {
  return (
    <section className={styles.section} id="faq">
      <Container>
        <div className={styles.header}>
          <Badge variant="teal">FAQs</Badge>
          <h2 className={styles.title}>Why Choose AVC Pet Care?</h2>
          <p className={styles.subtitle}>
            Have questions about visits, emergency response, or boarding? Here are quick answers to common queries.
          </p>
        </div>

        <div className={styles.faqList}>
          {FAQS.map((faq, index) => (
            <div key={index} className={styles.faqItem}>
              <h3 className={styles.question}>
                <span className={styles.qIcon}>Q.</span> {faq.question}
              </h3>
              <p className={styles.answer}>{faq.answer}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
