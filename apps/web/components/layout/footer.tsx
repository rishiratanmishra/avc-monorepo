import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "./container";
import { HOSPITAL_INFO } from "../../constants";
import { PhoneCall, Clock, ArrowUpRight } from "lucide-react";
import styles from "./footer.module.css";

const GOOGLE_G_ICON = (
  <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer} id="contact">
      {/* Emergency and routine care */}
      <div className={styles.preFooter}>
        <Container>
          <div className={styles.preFooterCard}>
            <div className={styles.preFooterContent}>
              <h2 className={styles.preFooterTitle}>
                Need emergency care?
              </h2>
              <p className={styles.preFooterDesc}>
                Call or walk in at our Sector 90 hospital. Emergency care is available 24/7; no appointment is needed.
              </p>
            </div>

            <div className={styles.preFooterActions}>
              <a href={`tel:${HOSPITAL_INFO.emergencyPhone}`} className={styles.emergencyCtaBtn}>
                <PhoneCall size={16} aria-hidden="true" />
                <span>Call {HOSPITAL_INFO.emergencyPhone}</span>
              </a>

              <a href="#services" className={styles.servicesCtaBtn}>
                <ArrowUpRight size={16} aria-hidden="true" />
                <span>View services</span>
              </a>
            </div>
          </div>
        </Container>
      </div>

      {/* 2. Main Hospital Directory */}
      <div className={styles.main}>
        <Container>
          <div className={styles.grid}>
            {/* Column 1: Hospital identity and reviews */}
            <div className={styles.brandCol}>
              <Link href="/" className={styles.logoContainer}>
                <Image
                  src="/images/logo-avc-hospital.png"
                  alt="AVC Multispeciality Pet Care Hospital"
                  width={180}
                  height={44}
                  className={styles.brandLogo}
                />
              </Link>

              <div className={styles.googleTrustBadge}>
                {GOOGLE_G_ICON}
                <span className={styles.googleScore}>4.8 / 5.0</span>
                <span className={styles.googleDivider}>•</span>
                <span className={styles.googleCount}>700+ Google Reviews</span>
              </div>
            </div>

            {/* Column 2: Medical services */}
            <div className={styles.linksCol}>
              <h3 className={styles.colTitle}>Medical Services</h3>
              <ul className={styles.linkList}>
                <li>
                  <Link href="#services" className={styles.footerLink}>
                    24/7 Emergency Care
                  </Link>
                </li>
                <li>
                  <Link href="#services" className={styles.footerLink}>
                    Diagnostics Lab
                  </Link>
                </li>
                <li>
                  <Link href="#services" className={styles.footerLink}>
                    Surgery &amp; Orthopedics
                  </Link>
                </li>
                <li>
                  <Link href="#services" className={styles.footerLink}>
                    Cat-Friendly OPD
                  </Link>
                </li>
                <li>
                  <Link href="#services" className={styles.footerLink}>
                    Digital X-Ray &amp; Doppler
                  </Link>
                </li>
                <li>
                  <Link href="#services" className={styles.footerLink}>
                    Dermatology &amp; Grooming
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Quick links */}
            <div className={styles.linksCol}>
              <h3 className={styles.colTitle}>Quick Links</h3>
              <ul className={styles.linkList}>
                <li>
                  <Link href="#why-choose-us" className={styles.footerLink}>
                    Why Choose AVC
                  </Link>
                </li>
                <li>
                  <Link href="#process" className={styles.footerLink}>
                    Pet Care Process
                  </Link>
                </li>
                <li>
                  <Link href="#testimonials" className={styles.footerLink}>
                    Testimonials
                  </Link>
                </li>
                <li>
                  <Link href="#faq" className={styles.footerLink}>
                    FAQs
                  </Link>
                </li>
                <li>
                  <a
                    href="https://maps.google.com/?q=AVC+Multispeciality+Pet+Hospital+Sector+90+Gurugram"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.footerLink}
                  >
                    <span>Sector 90 Directions</span>
                    <ArrowUpRight size={12} className={styles.inlineArrow} aria-hidden="true" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://maps.google.com/?q=AVC+Pet+World+Sector+87+Gurugram"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.footerLink}
                  >
                    <span>Sector 87 Resort Directions</span>
                    <ArrowUpRight size={12} className={styles.inlineArrow} aria-hidden="true" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Both Hospital Campuses */}
            <div className={styles.campusCol}>
              <h3 className={styles.colTitle}>Hospital Campuses</h3>

              {/* Campus 1: Sector 90 Hospital */}
              <div className={styles.campusCard}>
                <div className={styles.campusHeader}>
                  <strong className={styles.campusName}>Sector 90 Hospital</strong>
                  <span className={styles.campusOpenBadge}>24/7 Open</span>
                </div>
                <p className={styles.campusAddress}>
                  Near DLF Regal Garden, Badha-Hayatpur Road, Sector 90, Gurugram – 122505
                </p>
                <div className={styles.campusFooter}>
                  <div className={styles.metaRow}>
                    <Clock size={12} className={styles.metaIcon} aria-hidden="true" />
                    <span>Emergency ICU 24/7/365</span>
                  </div>
                  <a href={`tel:${HOSPITAL_INFO.emergencyPhone}`} className={styles.campusPhone}>
                    {HOSPITAL_INFO.emergencyPhone}
                  </a>
                </div>
              </div>

              {/* Campus 2: Sector 87 Pet World */}
              <div className={styles.campusCard}>
                <div className={styles.campusHeader}>
                  <strong className={styles.campusName}>Sector 87 Pet World</strong>
                  <span className={styles.campusResortBadge}>Resort &amp; OPD</span>
                </div>
                <p className={styles.campusAddress}>
                  Opp. Bharat Ram Global School Road, Sector 87, Gurugram
                </p>
                <div className={styles.campusFooter}>
                  <div className={styles.metaRow}>
                    <Clock size={12} className={styles.metaIcon} aria-hidden="true" />
                    <span>9:00 AM – 8:00 PM</span>
                  </div>
                  <a href={`tel:${HOSPITAL_INFO.emergencyPhone}`} className={styles.campusPhone}>
                    {HOSPITAL_INFO.emergencyPhone}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Bottom Legal & Registered Bar */}
          <div className={styles.bottomBar}>
            <p className={styles.copyright}>
              © {new Date().getFullYear()} {HOSPITAL_INFO.name}. Registered Veterinary Healthcare Establishment.
            </p>

            <div className={styles.legalNav}>
              <Link href="#contact" className={styles.legalLink}>
                Hospital Contact
              </Link>
              <span className={styles.legalDivider}>•</span>
              <Link href="#about" className={styles.legalLink}>
                Privacy Policy
              </Link>
              <span className={styles.legalDivider}>•</span>
              <Link href="#contact" className={styles.legalLink}>
                Terms &amp; Medical Conditions
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
};
