"use client";

import React from "react";
import Image from "next/image";
import { Container } from "../layout/container";
import { HOSPITAL_INFO } from "../../constants";
import { PhoneCall, MapPin, Clock, ArrowUpRight, ShieldCheck, Sparkles, Check } from "lucide-react";
import styles from "./campuses.module.css";

const CAMPUSES = [
  {
    id: "sector-90",
    isPrimary: true,
    tag: "Primary Clinical Hub",
    statusBadge: "24/7 Emergency ICU Open",
    name: "AVC Multispeciality Pet Hospital",
    subtitle: "Trauma ICU, Diagnostics & Advanced Surgeries",
    description:
      "Our main veterinary hospital equipped for critical care, emergency surgeries, and comprehensive diagnostic pathology. Veterinary surgeons and nurses are physically on-duty 24/7.",
    image: "/images/service-24-7-emergency-care.jpg",
    highlights: [
      "Physically on-duty emergency surgeons all night",
      "In-House IDEXX diagnostic lab (15-min reports)",
      "Sterile modular positive-pressure operating theaters",
      "Oxygen resuscitation cages & multiparameter ICU",
    ],
    address: "Near DLF Regal Garden, Badha-Hayatpur Road, Sector 90, Gurugram – 122505",
    hours: "Open 24/7 / 365 Days (Walk-ins Welcome)",
    phone: HOSPITAL_INFO.emergencyPhone,
    phoneAction: `tel:${HOSPITAL_INFO.emergencyPhone}`,
    ctaLabel: `Call Hospital: ${HOSPITAL_INFO.emergencyPhone}`,
    mapsUrl: "https://maps.google.com/?q=AVC+Multispeciality+Pet+Hospital+Sector+90+Gurugram",
  },
  {
    id: "sector-87",
    isPrimary: false,
    tag: "Luxury Wellness Campus",
    statusBadge: "Boarding & Daycare Center",
    name: "AVC Pet World & Resort",
    subtitle: "Luxury Boarding, Daycare, Grooming & OPD",
    description:
      "A dedicated, cage-free pet resort designed for comfortable boarding, social daycare, therapeutic grooming, and routine wellness OPD with round-the-clock veterinary oversight.",
    image: "/images/facility-pet-resort-boarding.jpg",
    highlights: [
      "Private air-conditioned suites & sound-dampened rooms",
      "Supervised outdoor play zones & social playtime",
      "Professional medicated grooming & spa treatments",
      "24/7 veterinary supervision & custom diet plans",
    ],
    address: "Opp. Ansal Heights, Bharat Ram Global School Road, Sector 87, Gurugram",
    hours: "9:00 AM – 8:00 PM (Daily)",
    phone: HOSPITAL_INFO.secondaryPhone,
    phoneAction: `tel:${HOSPITAL_INFO.secondaryPhone}`,
    ctaLabel: `Call Resort: ${HOSPITAL_INFO.secondaryPhone}`,
    mapsUrl: "https://maps.google.com/?q=AVC+Pet+World+Sector+87+Gurugram",
  },
];

export const Campuses: React.FC = () => {
  return (
    <section className={styles.section} id="campuses">
      <Container>
        {/* Section Header */}
        <div className={styles.header}>
          <span className={styles.eyebrow}>OUR GURUGRAM LOCATIONS</span>
          <h2 className={styles.title}>Two Dedicated Campuses. One Standard of Care.</h2>
          <p className={styles.subtitle}>
            Whether your pet requires urgent 24/7 emergency hospital care or a safe, relaxing resort stay, find the right AVC campus for their needs.
          </p>
        </div>

        {/* 2-Column Campus Comparison Grid */}
        <div className={styles.grid}>
          {CAMPUSES.map((campus) => (
            <div
              key={campus.id}
              className={`${styles.card} ${campus.isPrimary ? styles.cardPrimary : styles.cardSecondary}`}
            >
              {/* Campus Visual Frame */}
              <div className={styles.imageFrame}>
                <Image
                  src={campus.image}
                  alt={campus.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className={styles.campusImg}
                />
                <div className={styles.imageScrim} />

                {/* Top Badges */}
                <div className={styles.topBadgeRow}>
                  <span className={styles.tagBadge}>
                    {campus.isPrimary ? <ShieldCheck size={12} /> : <Sparkles size={12} />}
                    <span>{campus.tag}</span>
                  </span>
                  <span className={styles.statusBadge}>{campus.statusBadge}</span>
                </div>
              </div>

              {/* Campus Content Body */}
              <div className={styles.cardBody}>
                <div className={styles.titleGroup}>
                  <h3 className={styles.campusName}>{campus.name}</h3>
                  <span className={styles.campusSubtitle}>{campus.subtitle}</span>
                </div>

                <p className={styles.campusDesc}>{campus.description}</p>

                {/* Highlights List */}
                <ul className={styles.highlightList}>
                  {campus.highlights.map((item) => (
                    <li key={item} className={styles.highlightItem}>
                      <div className={styles.checkIconWrap} aria-hidden="true">
                        <Check size={12} strokeWidth={2.5} />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Location & Timings Details */}
                <div className={styles.metaBox}>
                  <div className={styles.metaRow}>
                    <MapPin size={15} className={styles.metaIcon} aria-hidden="true" />
                    <span>{campus.address}</span>
                  </div>
                  <div className={styles.metaRow}>
                    <Clock size={15} className={styles.metaIcon} aria-hidden="true" />
                    <span>{campus.hours}</span>
                  </div>
                </div>

                {/* Bottom Action Row: Call + Directions */}
                <div className={styles.actionRow}>
                  <a
                    href={campus.phoneAction}
                    className={campus.isPrimary ? styles.primaryBtn : styles.secondaryBtn}
                  >
                    <PhoneCall size={15} aria-hidden="true" />
                    <span>{campus.ctaLabel}</span>
                  </a>

                  <a
                    href={campus.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.directionsBtn}
                  >
                    <span>Directions</span>
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
