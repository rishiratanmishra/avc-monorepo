import React from "react";
import { Container } from "../../layout/container";
import { CARE_WORKFLOW } from "../../../constants/services-info";
import { Workflow, CheckCircle2 } from "lucide-react";
import styles from "./care-process.module.css";

export const CareProcess: React.FC = () => {
  return (
    <section className={styles.section} id="care-process" aria-labelledby="process-title">
      <Container>
        <div className={styles.header}>
          <div className={styles.tagWrap}>
            <Workflow className={styles.tagIcon} size={16} />
            <span>The AVC Standard of Care</span>
          </div>

          <h2 id="process-title" className={styles.title}>
            What to Expect During Your Visit
          </h2>

          <p className={styles.description}>
            We remove the mystery and fear from veterinary visits with a calm, transparent 4-stage patient journey designed for maximum pet comfort and owner peace of mind.
          </p>
        </div>

        <div className={styles.processGrid}>
          {CARE_WORKFLOW.map((step) => (
            <div key={step.step} className={styles.stepCard}>
              <div className={styles.stepHeader}>
                <span className={styles.stepNumber}>{step.step}</span>
                <span className={styles.stepHighlight}>
                  <CheckCircle2 size={13} className={styles.checkIcon} />
                  {step.highlight}
                </span>
              </div>

              <div className={styles.stepBody}>
                <span className={styles.stepSubtitle}>{step.subtitle}</span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.description}</p>
              </div>

              <div className={styles.progressLine} aria-hidden="true" />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
