import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "./container";
import { HOSPITAL_INFO } from "../../constants";
import styles from "./footer.module.css";

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer} id="contact">
      {/* 1. Pre-Footer High-Impact Action Banner */}
      <div className={styles.preFooter}>
        <Container>
          <div className={styles.ctaCard}>
            <div className={styles.ctaContent}>
              <span className={styles.ctaPill}>
                <span className={styles.livePulse} aria-hidden="true" />
                24/7 Emergency & Critical Care Active
              </span>
              <h3 className={styles.ctaTitle}>
                Compassionate Pet Care When You Need It Most
              </h3>
              <p className={styles.ctaDesc}>
                Whether it is a midnight medical emergency or a planned wellness checkup,
                our veterinary surgeons and trauma specialists in Gurugram are ready round the clock.
              </p>
            </div>

            <div className={styles.ctaActions}>
              <a
                href={`tel:${HOSPITAL_INFO.emergencyPhone}`}
                className={styles.ctaPrimaryBtn}
              >
                <span className={styles.btnIcon}>🚨</span>
                <div>
                  <span className={styles.btnSub}>Immediate 24/7 Help</span>
                  <span className={styles.btnMain}>{HOSPITAL_INFO.emergencyPhone}</span>
                </div>
              </a>

              <a
                href="#services"
                className={styles.ctaSecondaryBtn}
              >
                <span className={styles.btnIcon}>📅</span>
                <div>
                  <span className={styles.btnSub}>Consultations & Boarding</span>
                  <span className={styles.btnMain}>Book an Appointment</span>
                </div>
              </a>
            </div>
          </div>
        </Container>
      </div>

      {/* 2. Main Footer Navigation Grid */}
      <div className={styles.mainFooter}>
        <Container>
          <div className={styles.grid}>
            {/* Column 1: Brand & Trust Anchor */}
            <div className={styles.brandCol}>
              <div className={styles.brandLogoWrapper}>
                <Image
                  src="/images/logo-avc-hospital.png"
                  alt="AVC Multispeciality Pet Care Hospital Logo"
                  width={190}
                  height={48}
                  className={styles.brandLogo}
                />
              </div>

              <p className={styles.brandDesc}>
                {HOSPITAL_INFO.subtitle}. Dedicated to delivering gold-standard veterinary medicine,
                sterile surgical care, and luxury boarding in New Gurugram.
              </p>

              {/* Google Reviews Trust Badge */}
              <div className={styles.reviewBadge}>
                <div className={styles.stars}>★★★★★</div>
                <div className={styles.ratingText}>
                  <strong>4.9 / 5.0 Rating</strong>
                  <span>(2,500+ Happy Pet Parents)</span>
                </div>
              </div>

              {/* Social Channels */}
              <div className={styles.socialRow}>
                <span className={styles.socialLabel}>Connect With Us:</span>
                <div className={styles.socialIcons}>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialBtn}
                    aria-label="Facebook"
                  >
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95C18.05 21.45 22 17.2 22 12z" />
                    </svg>
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialBtn}
                    aria-label="Instagram"
                  >
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialBtn}
                    aria-label="YouTube"
                  >
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Column 2: Specialties & Medical Services */}
            <div>
              <h4 className={styles.colTitle}>Specialties & Services</h4>
              <ul className={styles.linkList}>
                <li>
                  <Link href="#services" className={styles.link}>
                    24/7 Emergency & ICU
                  </Link>
                </li>
                <li>
                  <Link href="#services" className={styles.link}>
                    Sterile Modular OT Surgeries
                  </Link>
                </li>
                <li>
                  <Link href="#services" className={styles.link}>
                    Feline-Friendly Cat OPD
                  </Link>
                </li>
                <li>
                  <Link href="#services" className={styles.link}>
                    Digital X-Ray & Diagnostics
                  </Link>
                </li>
                <li>
                  <Link href="#services" className={styles.link}>
                    Preventive Vaccinations
                  </Link>
                </li>
                <li>
                  <Link href="#services" className={styles.link}>
                    Therapeutic Pet Grooming & Spa
                  </Link>
                </li>
                <li>
                  <Link href="#services" className={styles.link}>
                    AVC Pet World Luxury Boarding
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Quick Links & Resources */}
            <div>
              <h4 className={styles.colTitle}>Patient & Hospital Info</h4>
              <ul className={styles.linkList}>
                <li>
                  <Link href="#about" className={styles.link}>
                    About Animates Vet Care
                  </Link>
                </li>
                <li>
                  <Link href="#process" className={styles.link}>
                    Care Journey & Admissions
                  </Link>
                </li>
                <li>
                  <Link href="#species" className={styles.link}>
                    Pets & Species We Treat
                  </Link>
                </li>
                <li>
                  <Link href="#faq" className={styles.link}>
                    Frequently Asked Questions
                  </Link>
                </li>
                <li>
                  <Link href="#testimonials" className={styles.link}>
                    Verified Pet Parent Reviews
                  </Link>
                </li>
                <li>
                  <a
                    href="http://localhost:3002"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    Hospital Staff Portal ↗
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Our 2 Gurugram Campuses (Structured M3 Cards) */}
            <div className={styles.campusesCol}>
              <h4 className={styles.colTitle}>Our Gurugram Campuses</h4>

              {/* Campus 1: Hospital & Emergency */}
              <div className={styles.campusCard}>
                <div className={styles.campusHeader}>
                  <span className={styles.campusTag}>🏥 Main Hospital</span>
                  <span className={styles.statusLive}>
                    <span className={styles.statusDot} /> 24/7 Open
                  </span>
                </div>
                <p className={styles.campusAddress}>
                  {HOSPITAL_INFO.hospitalCenter.address}, {HOSPITAL_INFO.hospitalCenter.landmark},{" "}
                  {HOSPITAL_INFO.hospitalCenter.city} ({HOSPITAL_INFO.hospitalCenter.pincode})
                </p>
                <div className={styles.campusActions}>
                  <a href={`tel:${HOSPITAL_INFO.emergencyPhone}`} className={styles.campusPhone}>
                    📞 {HOSPITAL_INFO.emergencyPhone}
                  </a>
                  <a
                    href="https://maps.google.com/?q=DLF+Regal+Garden+Sector+90+Gurugram+Animates+Vet+Care"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.campusMapLink}
                  >
                    View Map ↗
                  </a>
                </div>
              </div>

              {/* Campus 2: Luxury Resort & Boarding */}
              <div className={styles.campusCard}>
                <div className={styles.campusHeader}>
                  <span className={styles.campusTag}>🏡 Luxury Resort</span>
                  <span className={styles.statusRoutine}>OPD & Boarding</span>
                </div>
                <p className={styles.campusAddress}>
                  {HOSPITAL_INFO.resortCenter.landmark}, {HOSPITAL_INFO.resortCenter.address},{" "}
                  {HOSPITAL_INFO.resortCenter.city}
                </p>
                <div className={styles.campusActions}>
                  <a href={`tel:${HOSPITAL_INFO.secondaryPhone}`} className={styles.campusPhone}>
                    📞 {HOSPITAL_INFO.secondaryPhone}
                  </a>
                  <span className={styles.campusHours}>
                    ⏰ {HOSPITAL_INFO.routineHours.split("&")[0]?.trim() ?? HOSPITAL_INFO.routineHours}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Bottom Legal & Accreditation Bar */}
          <div className={styles.bottomBar}>
            <div className={styles.bottomLegal}>
              <p>
                © {new Date().getFullYear()} {HOSPITAL_INFO.name}. All rights reserved.
              </p>
              <p className={styles.accreditation}>
                Licensed Veterinary Practice • 24/7 Emergency & Inpatient Trauma Facility
              </p>
            </div>

            <div className={styles.bottomLinks}>
              <Link href="#contact" className={styles.bottomLink}>
                Emergency Protocol
              </Link>
              <span className={styles.bottomDivider}>•</span>
              <Link href="#about" className={styles.bottomLink}>
                Privacy Policy
              </Link>
              <span className={styles.bottomDivider}>•</span>
              <Link href="#contact" className={styles.bottomLink}>
                Terms of Service
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
};
