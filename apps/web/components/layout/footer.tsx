import React from "react";
import Link from "next/link";
import { Container } from "./container";
import { HOSPITAL_INFO, FOOTER_LINKS } from "../../constants";
import styles from "./footer.module.css";

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer} id="contact">
      <Container>
        <div className={styles.grid}>
          <div className={styles.brandCol}>
            <div className={styles.brand}>
              <img
                src="/images/logo-avc-hospital.png"
                alt="AVC Pet Hospital Logo"
                style={{ height: "42px", width: "auto" }}
              />
            </div>
            <p className={styles.brandDesc}>{HOSPITAL_INFO.tagline}</p>
            <p style={{ fontSize: "13px", color: "#8a97a8", fontStyle: "italic" }}>
              &ldquo;{HOSPITAL_INFO.quote}&rdquo;
            </p>
          </div>

          <div>
            <h4 className={styles.colTitle}>Services</h4>
            <ul className={styles.linkList}>
              {FOOTER_LINKS.services.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className={styles.link}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className={styles.colTitle}>Quick Links</h4>
            <ul className={styles.linkList}>
              {FOOTER_LINKS.company.map((item) => (
                <li key={item.label}>
                  {item.isExternal ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.link}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link href={item.href} className={styles.link}>
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className={styles.colTitle}>Our Centres & Contact</h4>
            <div style={{ marginBottom: "14px" }}>
              <strong style={{ color: "#ffffff", fontSize: "13px", display: "block" }}>
                🏥 Main Hospital & 24/7 Emergency:
              </strong>
              <p className={styles.contactItem} style={{ marginBottom: "2px" }}>
                {HOSPITAL_INFO.hospitalCenter.address}, {HOSPITAL_INFO.hospitalCenter.landmark},{" "}
                {HOSPITAL_INFO.hospitalCenter.city} - {HOSPITAL_INFO.hospitalCenter.pincode}
              </p>
            </div>

            <div style={{ marginBottom: "14px" }}>
              <strong style={{ color: "#ffffff", fontSize: "13px", display: "block" }}>
                🏡 Boarding & Daycare Resort:
              </strong>
              <p className={styles.contactItem} style={{ marginBottom: "2px" }}>
                {HOSPITAL_INFO.resortCenter.name}, {HOSPITAL_INFO.resortCenter.landmark},{" "}
                {HOSPITAL_INFO.resortCenter.address}, {HOSPITAL_INFO.resortCenter.city}
              </p>
            </div>

            <p className={styles.contactItem}>
              📞 <strong>Helpline:</strong>{" "}
              <a href={`tel:${HOSPITAL_INFO.phone}`} style={{ color: "#b2dfdb" }}>
                {HOSPITAL_INFO.phone}
              </a>{" "}
              /{" "}
              <a href={`tel:${HOSPITAL_INFO.secondaryPhone}`} style={{ color: "#b2dfdb" }}>
                {HOSPITAL_INFO.secondaryPhone}
              </a>
            </p>
            <p className={styles.contactItem}>
              ⏰ <strong>OPD:</strong> {HOSPITAL_INFO.routineHours}
            </p>
            <p className={styles.contactItem} style={{ color: "#ff7875" }}>
              🚨 <strong>Emergency:</strong> {HOSPITAL_INFO.emergencyHours}
            </p>
          </div>
        </div>

        <div className={styles.bottom}>
          <span>
            © {new Date().getFullYear()} {HOSPITAL_INFO.name}. All rights reserved.
          </span>
          <span>Regal Garden, Sector 90 & Sector 87, Gurugram, Haryana</span>
        </div>
      </Container>
    </footer>
  );
};
