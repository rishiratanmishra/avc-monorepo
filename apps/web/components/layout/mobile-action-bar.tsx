import React from "react";
import { HOSPITAL_INFO } from "../../constants";
import styles from "./mobile-action-bar.module.css";

export const MobileActionBar: React.FC = () => {
  return (
    <div className={styles.barContainer} role="region" aria-label="Quick Actions">
      <div className={styles.inner}>
        <a
          href={`tel:${HOSPITAL_INFO.emergencyPhone}`}
          className={`${styles.btn} ${styles.emergencyBtn}`}
          aria-label="Call 24/7 Emergency Hospital"
        >
          <span className={styles.iconPulse} aria-hidden="true">🚨</span>
          <span className={styles.btnText}>
            <span className={styles.btnSub}>24/7 Emergency</span>
            <span className={styles.btnMain}>Call Hospital</span>
          </span>
        </a>

        <a
          href="#services"
          className={`${styles.btn} ${styles.bookingBtn}`}
          aria-label="Book Pet OPD Consultation"
        >
          <span className={styles.icon} aria-hidden="true">📅</span>
          <span className={styles.btnText}>
            <span className={styles.btnSub}>OPD &amp; Boarding</span>
            <span className={styles.btnMain}>Book Visit</span>
          </span>
        </a>
      </div>
    </div>
  );
};
