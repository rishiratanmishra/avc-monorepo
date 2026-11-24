"use client";

import React from "react";
import { Container } from "../../layout/container";
import { HOSPITAL_INFO } from "../../../constants";
import { PhoneCall, Mail, MapPin, Clock, ShieldAlert } from "lucide-react";
import styles from "./contact-hero.module.css";

export const ContactHero: React.FC = () => {
  return (
    <section className={styles.section} aria-labelledby="contact-hero-title">
      <Container>
        {/* Header Content */}
        <div className={styles.header}>
          <span className={styles.eyebrow}>24/7 Clinical Care &amp; Hospital Helpdesk</span>

          <h1 id="contact-hero-title" className={styles.title}>
            Get in Touch with <span className={styles.titleHighlight}>AVC Pet Hospital</span>
          </h1>

          <p className={styles.description}>
            Whether your pet needs emergency trauma care at our 24/7 Sector 90 Intensive Care Unit or a luxury stay at our Sector 87 Pet World Resort, our veterinary team is ready to help.
          </p>
        </div>

        {/* 24/7 Urgent Triage Banner */}
        <div className={styles.emergencyBanner} role="alert">
          <div className={styles.emergencyIconWrap}>
            <ShieldAlert size={22} aria-hidden="true" />
          </div>
          <div className={styles.emergencyContent}>
            <span className={styles.emergencyTag}>Immediate Emergency?</span>
            <p className={styles.emergencyText}>
              Do not wait for an online form response. Call our Sector 90 Emergency ICU directly or walk in immediately — zero appointment needed for trauma.
            </p>
          </div>
          <a
            href={`tel:${HOSPITAL_INFO.emergencyPhone.replace(/\s+/g, "")}`}
            className={styles.emergencyCallBtn}
          >
            <PhoneCall size={16} aria-hidden="true" />
            <span>Call 24/7: {HOSPITAL_INFO.emergencyPhone}</span>
          </a>
        </div>

        {/* Quick Contact Chips */}
        <div className={styles.quickContacts}>
          <div className={styles.contactChip}>
            <div className={styles.chipIcon}>
              <PhoneCall size={16} aria-hidden="true" />
            </div>
            <div className={styles.chipText}>
              <span className={styles.chipLabel}>Main Hospital (24/7)</span>
              <a href={`tel:${HOSPITAL_INFO.phone.replace(/\s+/g, "")}`} className={styles.chipValue}>
                {HOSPITAL_INFO.phone}
              </a>
            </div>
          </div>

          <div className={styles.contactChip}>
            <div className={styles.chipIcon}>
              <PhoneCall size={16} aria-hidden="true" />
            </div>
            <div className={styles.chipText}>
              <span className={styles.chipLabel}>Sector 87 Resort &amp; Spa</span>
              <a href={`tel:${HOSPITAL_INFO.secondaryPhone.replace(/\s+/g, "")}`} className={styles.chipValue}>
                {HOSPITAL_INFO.secondaryPhone}
              </a>
            </div>
          </div>

          <div className={styles.contactChip}>
            <div className={styles.chipIcon}>
              <Mail size={16} aria-hidden="true" />
            </div>
            <div className={styles.chipText}>
              <span className={styles.chipLabel}>Email Support</span>
              <a href={`mailto:${HOSPITAL_INFO.email}`} className={styles.chipValue}>
                {HOSPITAL_INFO.email}
              </a>
            </div>
          </div>

          <div className={styles.contactChip}>
            <div className={styles.chipIcon}>
              <Clock size={16} aria-hidden="true" />
            </div>
            <div className={styles.chipText}>
              <span className={styles.chipLabel}>Routine OPD Hours</span>
              <span className={styles.chipValue}>{HOSPITAL_INFO.routineHours}</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
