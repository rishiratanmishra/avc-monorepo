"use client";

import React from "react";
import Image from "next/image";
import { Container } from "../../layout/container";
import { HOSPITAL_INFO } from "../../../constants";
import {
  MapPin,
  PhoneCall,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Navigation,
  Car,
} from "lucide-react";
import styles from "./contact-campuses.module.css";

const CAMPUS_DETAILS = [
  {
    id: "sector-90",
    name: "AVC Multispeciality Pet Hospital",
    badge: "24/7 Trauma Emergency ICU",
    isEmergency: true,
    image: "/images/service-24-7-emergency-care.jpg",
    address: "Near DLF Regal Garden, Badha-Hayatpur Road, Sector 90, Gurugram – 122505",
    landmark: "Direct access from Dwarka Expressway & New Gurugram",
    hours: "Open 24/7/365 (Emergency & Routine OPD)",
    phone: HOSPITAL_INFO.emergencyPhone,
    phoneAction: `tel:${HOSPITAL_INFO.emergencyPhone.replace(/\s+/g, "")}`,
    mapsUrl: "https://maps.google.com/?q=AVC+Multispeciality+Pet+Hospital+Sector+90+Gurugram",
    features: [
      "24/7 trauma emergency veterinary surgeons on-site",
      "Sterile positive-pressure modular operating theaters",
      "In-house 15-minute rapid IDEXX diagnostic lab",
      "Acoustically isolated dog-free Cat Care OPD suite",
      "Dedicated stretcher access & free emergency parking",
    ],
  },
  {
    id: "sector-87",
    name: "AVC Pet World & Luxury Resort",
    badge: "Luxury Boarding & Grooming Spa",
    isEmergency: false,
    image: "/images/facility-pet-resort-boarding.jpg",
    address: "Opp. Ansal Heights, Bharat Ram Global School Road, Sector 87, Gurugram",
    landmark: "Conveniently located near NH-48 & Manesar",
    hours: "9:00 AM – 8:00 PM (Monday to Sunday)",
    phone: HOSPITAL_INFO.secondaryPhone,
    phoneAction: `tel:${HOSPITAL_INFO.secondaryPhone.replace(/\s+/g, "")}`,
    mapsUrl: "https://maps.google.com/?q=AVC+Pet+World+Sector+87+Gurugram",
    features: [
      "Air-conditioned private suites with CCTV streaming",
      "Sanitized, filtered pet splash pool & agility lawn",
      "Therapeutic grooming & medicated spa treatments",
      "24/7 on-site veterinary supervision & custom diets",
      "Daily WhatsApp photo & video updates for parents",
    ],
  },
];

export const ContactCampuses: React.FC = () => {
  return (
    <section className={styles.section} id="campuses-locations" aria-labelledby="campuses-heading">
      <Container>
        <div className={styles.header}>
          <span className={styles.eyebrow}>Two Specialized Facilities</span>

          <h2 id="campuses-heading" className={styles.title}>
            Visit Our <span className={styles.titleHighlight}>Gurugram Campuses</span>
          </h2>

          <p className={styles.description}>
            Both campuses are equipped with dedicated veterinary staff, secure parking, and clean clinical facilities designed for pet comfort.
          </p>
        </div>

        <div className={styles.grid}>
          {CAMPUS_DETAILS.map((campus) => (
            <article key={campus.id} className={styles.campusCard}>
              {/* Media Header */}
              <div className={styles.mediaWrapper}>
                <Image
                  src={campus.image}
                  alt={campus.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className={styles.mediaImage}
                />
                <span
                  className={`${styles.campusBadge} ${
                    campus.isEmergency ? styles.emergencyBadge : ""
                  }`}
                >
                  {campus.badge}
                </span>
              </div>

              {/* Card Body */}
              <div className={styles.cardBody}>
                <h3 className={styles.campusTitle}>{campus.name}</h3>

                {/* Info List */}
                <div className={styles.infoList}>
                  <div className={styles.infoItem}>
                    <MapPin size={16} className={styles.infoIcon} aria-hidden="true" />
                    <div>
                      <p className={styles.infoText}>{campus.address}</p>
                      <span className={styles.landmarkText}>{campus.landmark}</span>
                    </div>
                  </div>

                  <div className={styles.infoItem}>
                    <Clock size={16} className={styles.infoIcon} aria-hidden="true" />
                    <div>
                      <p className={styles.infoText}>{campus.hours}</p>
                    </div>
                  </div>

                  <div className={styles.infoItem}>
                    <PhoneCall size={16} className={styles.infoIcon} aria-hidden="true" />
                    <div>
                      <a href={campus.phoneAction} className={styles.phoneLink}>
                        {campus.phone}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Key Facilities Highlights */}
                <div className={styles.featuresBox}>
                  <span className={styles.featuresHeading}>Facility Highlights:</span>
                  <ul className={styles.featureList}>
                    {campus.features.map((feat, idx) => (
                      <li key={idx} className={styles.featureItem}>
                        <ShieldCheck size={13} className={styles.checkIcon} aria-hidden="true" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card Action Buttons */}
              <div className={styles.cardFooter}>
                <a
                  href={campus.phoneAction}
                  className={`${styles.primaryBtn} ${
                    campus.isEmergency ? styles.emergencyBtn : ""
                  }`}
                >
                  <PhoneCall size={15} aria-hidden="true" />
                  <span>Call {campus.isEmergency ? "Emergency" : "Resort"}</span>
                </a>

                <a
                  href={campus.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.directionsBtn}
                >
                  <Navigation size={14} aria-hidden="true" />
                  <span>Get Directions</span>
                  <ArrowUpRight size={13} aria-hidden="true" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
};
