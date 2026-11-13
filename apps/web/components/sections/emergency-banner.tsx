import React from "react";
import { Container } from "../layout/container";
import { HOSPITAL_INFO } from "../../constants";
import { ExclamationTriangleIcon, PhoneIcon } from "@heroicons/react/24/solid";
import styles from "./emergency-banner.module.css";

export const EmergencyBanner: React.FC = () => {
  return (
    <div className={styles.banner} id="emergency">
      <Container>
        <div className={styles.inner}>
          <div className={styles.info}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <ExclamationTriangleIcon style={{ width: 18, height: 18, flexShrink: 0, color: "#fee2e2" }} aria-hidden="true" />
              <span>
                <strong>24/7 Emergency Pet Hospital in Gurugram</strong> — Critical trauma &amp; ICU care available round the clock.
              </span>
            </span>
          </div>
          <div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <PhoneIcon style={{ width: 14, height: 14, flexShrink: 0, color: "#fee2e2" }} aria-hidden="true" />
              <span>Emergency Helpline: </span>
              <a href={`tel:${HOSPITAL_INFO.emergencyPhone}`} className={styles.callNow}>
                {HOSPITAL_INFO.emergencyPhone}
              </a>
            </span>
          </div>
        </div>
      </Container>
    </div>
  );
};
