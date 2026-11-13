import React from "react";
import { Container } from "../layout/container";
import { HOSPITAL_INFO } from "../../constants";
import styles from "./emergency-banner.module.css";

export const EmergencyBanner: React.FC = () => {
  return (
    <div className={styles.banner} id="emergency">
      <Container>
        <div className={styles.inner}>
          <div className={styles.info}>
            <span>
              🚨 <strong>24/7 Emergency Pet Hospital in Gurugram</strong> — Critical trauma & ICU care available round the clock.
            </span>
          </div>
          <div>
            <span>Emergency Helpline: </span>
            <a href={`tel:${HOSPITAL_INFO.emergencyPhone}`} className={styles.callNow}>
              {HOSPITAL_INFO.emergencyPhone}
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
};
