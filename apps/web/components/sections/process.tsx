import React from "react";
import { Container } from "../layout/container";
import { Badge } from "../ui/badge";
import { PET_CARE_PROCESS } from "../../constants";
import styles from "./process.module.css";

export const PetCareProcess: React.FC = () => {
  return (
    <section className={styles.section} id="process">
      <Container>
        <div className={styles.header}>
          <Badge variant="teal">Our Service Process</Badge>
          <h2 className={styles.title}>Your Pet&apos;s Seamless Care Journey</h2>
          <p className={styles.subtitle}>
            From booking your consultation to expert recovery, we ensure a warm, transparent, and compassionate experience.
          </p>
        </div>

        <div className={styles.grid}>
          {PET_CARE_PROCESS.map((step) => (
            <div key={step.step} className={styles.stepCard}>
              <div className={styles.imageWrap}>
                <span className={styles.stepBadge}>{step.step}</span>
                <img
                  src={step.image}
                  alt={step.title}
                  className={styles.stepImage}
                  loading="lazy"
                />
              </div>
              <div className={styles.content}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
