import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "./container";
import { HOSPITAL_INFO, FOOTER_LINKS } from "../../constants";
import { PhoneIcon, CalendarDaysIcon, StarIcon } from "@heroicons/react/24/solid";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import styles from "./footer.module.css";

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer} id="contact">
      {/* 1. Grounded Emergency & Consultation Contact Strip */}
      <div className={styles.contactStrip}>
        <Container>
          <div className={styles.contactStripInner}>
            <div className={styles.contactText}>
              <span className={styles.contactEyebrow}>24/7 Veterinary Emergency Care</span>
              <h3 className={styles.contactTitle}>
                Immediate medical support for your pet in Gurugram
              </h3>
              <p className={styles.contactDesc}>
                Our critical care ICU, surgical operating theaters, and diagnostic lab are fully staffed
                day and night. No prior appointment is needed for emergencies.
              </p>
            </div>

            <div className={styles.contactButtons}>
              <a
                href={`tel:${HOSPITAL_INFO.emergencyPhone}`}
                className={styles.emergencyBtn}
              >
                <span className={styles.btnIcon}>
                  <PhoneIcon style={{ width: 22, height: 22 }} aria-hidden="true" />
                </span>
                <span>
                  <strong className={styles.btnLabel}>Emergency Helpline</strong>
                  <span className={styles.btnValue}>{HOSPITAL_INFO.emergencyPhone}</span>
                </span>
              </a>

              <a
                href="#services"
                className={styles.consultBtn}
              >
                <span className={styles.btnIcon}>
                  <CalendarDaysIcon style={{ width: 22, height: 22 }} aria-hidden="true" />
                </span>
                <span>
                  <strong className={styles.btnLabel}>Routine Care &amp; Boarding</strong>
                  <span className={styles.btnValue}>Book OPD Consultation</span>
                </span>
              </a>
            </div>
          </div>
        </Container>
      </div>

      {/* 2. Main Clinical Directory */}
      <div className={styles.main}>
        <Container>
          <div className={styles.grid}>
            {/* Column 1: Hospital Identity & Mission */}
            <div className={styles.aboutCol}>
              <div className={styles.logoContainer}>
                <Image
                  src="/images/logo-avc-hospital.png"
                  alt="AVC Multispeciality Pet Care Hospital"
                  width={180}
                  height={44}
                  className={styles.logoImage}
                />
              </div>

              <p className={styles.missionText}>
                Animates Vet Care (AVC) is New Gurugram&apos;s premier multi-speciality veterinary
                center and luxury pet resort, led by Dr. Hardeep Beniwal. Dedicated to advanced
                diagnostics, surgical precision, and compassionate animal recovery.
              </p>

              <div className={styles.ratingBox}>
                <span className={styles.ratingStars} aria-label="5 out of 5 stars">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} style={{ width: 14, height: 14, color: "#f59e0b", display: "inline-block" }} aria-hidden="true" />
                  ))}
                </span>
                <span className={styles.ratingNumber}>4.9/5</span>
                <span className={styles.ratingSource}>on Google Reviews</span>
              </div>
            </div>

            {/* Column 2: Clinical Services */}
            <div>
              <h4 className={styles.colHeading}>Medical Services</h4>
              <ul className={styles.linkList}>
                {FOOTER_LINKS.services.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className={styles.link}>
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="#services" className={styles.link}>
                    Feline Cat Care OPD
                  </Link>
                </li>
                <li>
                  <Link href="#services" className={styles.link}>
                    Medicated Grooming &amp; Spa
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Patient Care Links */}
            <div>
              <h4 className={styles.colHeading}>Quick Links</h4>
              <ul className={styles.linkList}>
                <li>
                  <Link href="#about" className={styles.link}>
                    About Our Hospital
                  </Link>
                </li>
                <li>
                  <Link href="#process" className={styles.link}>
                    Care Journey &amp; Process
                  </Link>
                </li>
                <li>
                  <Link href="#faq" className={styles.link}>
                    Pet Parent FAQs
                  </Link>
                </li>
                <li>
                  <Link href="#testimonials" className={styles.link}>
                    Client Experiences
                  </Link>
                </li>
                <li>
                  <a
                    href="http://localhost:3002"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    <span>Hospital Staff Portal</span>
                    <ArrowTopRightOnSquareIcon style={{ width: 13, height: 13, marginLeft: 4, display: "inline-block", verticalAlign: "middle" }} aria-hidden="true" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Gurugram Hospital & Resort Campuses */}
            <div className={styles.campusCol}>
              <h4 className={styles.colHeading}>Our Hospital Centres</h4>

              <div className={styles.campusItem}>
                <div className={styles.campusTitleRow}>
                  <strong className={styles.campusName}>Sector 90 Hospital &amp; Emergency</strong>
                  <span className={styles.openPill}>24/7 Open</span>
                </div>
                <p className={styles.campusDetails}>
                  {HOSPITAL_INFO.hospitalCenter.address}, {HOSPITAL_INFO.hospitalCenter.landmark},{" "}
                  {HOSPITAL_INFO.hospitalCenter.city} - {HOSPITAL_INFO.hospitalCenter.pincode}
                </p>
                <div className={styles.campusContactRow}>
                  <a href={`tel:${HOSPITAL_INFO.emergencyPhone}`} className={styles.phoneLink}>
                    {HOSPITAL_INFO.emergencyPhone}
                  </a>
                  <a
                    href="https://maps.google.com/?q=DLF+Regal+Garden+Sector+90+Gurugram+Animates+Vet+Care"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.mapLink}
                  >
                    <span>Directions</span>
                    <ArrowTopRightOnSquareIcon style={{ width: 12, height: 12, marginLeft: 3, display: "inline-block", verticalAlign: "middle" }} aria-hidden="true" />
                  </a>
                </div>
              </div>

              <div className={styles.campusItem}>
                <div className={styles.campusTitleRow}>
                  <strong className={styles.campusName}>Sector 87 Luxury Resort</strong>
                  <span className={styles.routinePill}>OPD &amp; Boarding</span>
                </div>
                <p className={styles.campusDetails}>
                  {HOSPITAL_INFO.resortCenter.landmark}, {HOSPITAL_INFO.resortCenter.address},{" "}
                  {HOSPITAL_INFO.resortCenter.city}
                </p>
                <div className={styles.campusContactRow}>
                  <a href={`tel:${HOSPITAL_INFO.secondaryPhone}`} className={styles.phoneLink}>
                    {HOSPITAL_INFO.secondaryPhone}
                  </a>
                  <span className={styles.hoursNote}>
                    9:00 AM – 8:00 PM
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Bottom Legal & Copyright Bar */}
          <div className={styles.bottomBar}>
            <p className={styles.copyright}>
              © {new Date().getFullYear()} {HOSPITAL_INFO.name}. Registered Veterinary Healthcare Establishment.
            </p>

            <div className={styles.bottomNav}>
              <Link href="#contact" className={styles.bottomNavLink}>
                Contact Hospital
              </Link>
              <span className={styles.divider}>•</span>
              <Link href="#about" className={styles.bottomNavLink}>
                Privacy Policy
              </Link>
              <span className={styles.divider}>•</span>
              <Link href="#contact" className={styles.bottomNavLink}>
                Terms
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
};
