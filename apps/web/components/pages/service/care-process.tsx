"use client";

import React from "react";
import { Container } from "../../layout/container";
import { CARE_WORKFLOW } from "../../../constants/services-info";
import {
  ClipboardCheck,
  Stethoscope,
  Cpu,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import styles from "./care-process.module.css";

const STEP_ICONS = [
  ClipboardCheck,
  Stethoscope,
  Cpu,
  ShieldCheck,
];

export const CareProcess: React.FC = () => {
  return (
    <section className={styles.section} id="care-process" aria-labelledby="process-title">
      <Container>
        {/* Section Header */}
        <div className={styles.header}>
          <span className={styles.eyebrow}>The AVC Patient Journey</span>

          <h2 id="process-title" className={styles.title}>
            What to Expect During <span className={styles.titleHighlight}>Your Visit</span>
          </h2>

          <p className={styles.description}>
            We remove the mystery and anxiety from veterinary visits with a calm, transparent 4-stage patient journey designed for maximum pet comfort and owner peace of mind.
          </p>
        </div>

        {/* Connected Step Timeline (Desktop: Horizontal Flow, Mobile: Vertical Stepper) */}
        <div className={styles.timelineWrapper}>
          <div className={styles.timelineGrid}>
            {CARE_WORKFLOW.map((step, index) => {
              const IconComp = STEP_ICONS[index] || ClipboardCheck;
              const isLast = index === CARE_WORKFLOW.length - 1;

              return (
                <div key={step.step} className={styles.stepCol}>
                  {/* Step Card */}
                  <article className={styles.stepCard}>
                    {/* Top Row: Step Number + Icon + Flow Arrow */}
                    <div className={styles.stepCardHeader}>
                      <div className={styles.stepBadgeGroup}>
                        <span className={styles.stepNumberBadge}>{step.step}</span>
                        <div className={styles.iconCircle}>
                          <IconComp size={18} aria-hidden="true" />
                        </div>
                      </div>

                      {!isLast && (
                        <div className={styles.flowArrow} aria-hidden="true">
                          <ArrowRight size={16} />
                        </div>
                      )}
                    </div>

                    {/* Step Content */}
                    <div className={styles.stepCardBody}>
                      <span className={styles.stepPhaseTag}>
                        Stage 0{index + 1}
                      </span>
                      <h3 className={styles.stepTitle}>{step.title}</h3>
                      <span className={styles.stepSubtitle}>{step.subtitle}</span>
                      <p className={styles.stepDesc}>{step.description}</p>
                    </div>

                    {/* Step Highlight Pill */}
                    <div className={styles.stepCardFooter}>
                      <div className={styles.highlightPill}>
                        <CheckCircle2 size={13} className={styles.checkIcon} aria-hidden="true" />
                        <span>{step.highlight}</span>
                      </div>
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
};
