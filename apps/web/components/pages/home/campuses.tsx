"use client";

import React from "react";
import Image from "next/image";
import { Container } from "../../layout/container";
import { HOSPITAL_INFO } from "../../../constants";
import { PhoneCall, MapPin, Clock, ArrowUpRight, Check } from "lucide-react";
import styles from "./campuses.module.css";

const CAMPUSES = [
  {
    id: "sector-90",
    name: "AVC Multispeciality Pet Hospital",
    subtitle: "24/7 Emergency Care, Diagnostics & Surgery",
    description:
      "Our main hospital provides emergency and critical care, surgery, diagnostics, and routine consultations. Veterinary staff are on site 24/7.",
    image: "/images/service-24-7-emergency-care.jpg",
    highlights: [
      "Emergency surgeons on site overnight",
      "In-house IDEXX diagnostic lab",
      "Positive-pressure operating theatres",
      "Oxygen cages and ICU monitoring",
    ],
    address: "Near DLF Regal Garden, Badha-Hayatpur Road, Sector 90, Gurugram – 122505",
    hours: "Open 24/7; walk-ins welcome",
    phone: HOSPITAL_INFO.emergencyPhone,
    phoneAction: `tel:${HOSPITAL_INFO.emergencyPhone.replace(/\s+/g, "")}`,
    ctaLabel: "Call hospital",
    mapsUrl: "https://maps.google.com/?q=AVC+Multispeciality+Pet+Hospital+Sector+90+Gurugram",
  },
  {
    id: "sector-87",
    name: "AVC Pet World & Resort",
    subtitle: "Boarding, Daycare, Grooming & Routine Care",
    description:
      "AVC Pet World offers boarding, daycare, grooming, and routine wellness visits, with veterinary oversight.",
    image: "/images/facility-pet-resort-boarding.jpg",
    highlights: [
      "Air-conditioned private suites",
      "Supervised outdoor play",
      "Medicated grooming",
      "Veterinary oversight and custom diets",
    ],
    address: "Opp. Ansal Heights, Bharat Ram Global School Road, Sector 87, Gurugram",
    hours: "9:00 AM – 8:00 PM (Daily)",
    phone: HOSPITAL_INFO.secondaryPhone,
    phoneAction: `tel:${HOSPITAL_INFO.secondaryPhone.replace(/\s+/g, "")}`,
    ctaLabel: "Call resort",
    mapsUrl: "https://maps.google.com/?q=AVC+Pet+World+Sector+87+Gurugram",
  },
];

export const Campuses: React.FC = () => {
  return (
    <section className={styles.section} id="campuses">
      <Container>
        <div className={styles.header}>
          <h2 className={styles.title}>Two Dedicated Campuses</h2>
          <p className={styles.subtitle}>
            Our hospital is open 24/7. AVC Pet World offers boarding, daycare, and grooming.
          </p>
        </div>

        <div className={styles.grid}>
          {CAMPUSES.map((campus) => (
            <div key={campus.id} className={styles.card}>
              <div className={styles.imageFrame}>
                <Image
                  src={campus.image}
                  alt={campus.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className={styles.campusImg}
                />
              </div>

              <div className={styles.cardBody}>
                <div className={styles.titleGroup}>
                  <h3 className={styles.campusName}>{campus.name}</h3>
                  <span className={styles.campusSubtitle}>{campus.subtitle}</span>
                </div>

                <p className={styles.campusDesc}>{campus.description}</p>

                <ul className={styles.highlightList}>
                  {campus.highlights.map((item) => (
                    <li key={item} className={styles.highlightItem}>
                      <Check size={14} className={styles.checkIcon} aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

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

                <div className={styles.actionRow}>
                  <a
                    href={campus.phoneAction}
                    className={styles.primaryBtn}
                  >
                    <PhoneCall size={15} aria-hidden="true" />
                    <span>{campus.ctaLabel} · {campus.phone}</span>
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
