import React from "react";
import Link from "next/link";
import { Container } from "../../layout/container";
import { TRIAGE_GUIDE } from "../../../constants/services-info";
import { AlertTriangle, Clock, ArrowRight, PhoneCall, ShieldAlert, CheckCircle } from "lucide-react";
import styles from "./triage-guide.module.css";

export const TriageGuide: React.FC = () => {
  return (
    <section className={styles.section} id="triage-guide" aria-labelledby="triage-title">
      <Container>
        <div className={styles.header}>
          <div className={styles.tagWrap}>
            <ShieldAlert className={styles.tagIcon} size={16} />
            <span>Symptom Triage Guide</span>
          </div>

          <h2 id="triage-title" className={styles.title}>
            When Should You Bring Your Pet In?
          </h2>

          <p className={styles.description}>
            Use this clinical triage guide to determine whether your pet requires immediate 24/7 walk-in critical care or a scheduled outpatient consultation.
          </p>
        </div>

        <div className={styles.triageGrid}>
          {TRIAGE_GUIDE.map((col) => {
            const isEmergency = col.level === "emergency";
            return (
              <div
                key={col.id}
                className={`${styles.card} ${isEmergency ? styles.emergencyCard : styles.routineCard}`}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.iconBadge}>
                    {isEmergency ? (
                      <AlertTriangle size={24} className={styles.emergencyIcon} />
                    ) : (
                      <Clock size={24} className={styles.routineIcon} />
                    )}
                  </div>
                  <div>
                    <span className={styles.timeframe}>{col.timeframe}</span>
                    <h3 className={styles.cardTitle}>{col.title}</h3>
                  </div>
                </div>

                <div className={styles.symptomsBox}>
                  <h4 className={styles.symptomsHeading}>
                    {isEmergency ? "Common Critical Warning Signs" : "Routine Indications & Checkups"}
                  </h4>
                  <ul className={styles.symptomList}>
                    {col.symptoms.map((symptom, idx) => (
                      <li key={idx} className={styles.symptomItem}>
                        <div
                          className={isEmergency ? styles.alertDot : styles.checkDot}
                          aria-hidden="true"
                        >
                          {isEmergency ? "!" : "✓"}
                        </div>
                        <span>{symptom}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={styles.recommendationBox}>
                  <strong>Action Required:</strong>
                  <p>{col.recommendedAction}</p>
                </div>

                <div className={styles.cardFooter}>
                  {isEmergency ? (
                    <a href={col.actionHref} className={styles.emergencyActionBtn}>
                      <PhoneCall size={16} />
                      <span>{col.actionText}</span>
                    </a>
                  ) : (
                    <Link href={col.actionHref} className={styles.routineActionBtn}>
                      <span>{col.actionText}</span>
                      <ArrowRight size={16} />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
