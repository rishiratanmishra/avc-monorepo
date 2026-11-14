import React from "react";
import { Container } from "../../layout/container";
import { VALUE_PILLARS } from "../../../constants/about-info";
import styles from "./mission-values.module.css";

export const MissionValues: React.FC = () => {
  return (
    <section className={styles.section} id="mission-values" aria-labelledby="mission-title">
      <Container>
        <div className={styles.header}>
          <span className={styles.eyebrow}>Our approach</span>

          <h2 id="mission-title" className={styles.title}>
            Veterinary care, guided by clear priorities
          </h2>

          <p className={styles.description}>
            We provide a range of veterinary services in a calm setting and explain treatment options to pet owners.
          </p>
        </div>

        <div className={styles.grid}>
          {VALUE_PILLARS.map((pillar) => (
            <div key={pillar.id} className={styles.card}>
              <div className={styles.cardContent}>
                <span className={styles.pillarSubtitle}>{pillar.subtitle}</span>
                <h3 className={styles.pillarTitle}>{pillar.title}</h3>
                <p className={styles.pillarDesc}>{pillar.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
