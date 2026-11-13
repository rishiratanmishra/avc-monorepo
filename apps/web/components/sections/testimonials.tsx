"use client";

import React from "react";
import Image from "next/image";
import { Container } from "../layout/container";
import { Star, CheckCircle2, ExternalLink } from "lucide-react";
import styles from "./testimonials.module.css";

const GOOGLE_G_ICON = (
  <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true" className={styles.googleG}>
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

const REAL_GOOGLE_REVIEWS = [
  {
    id: "shipra",
    author: "Shipra Tyagi",
    pet: "Parent to Macxo",
    serviceTag: "Tumor Diagnosis & Surgery",
    rating: 5,
    avatar: "/images/testimonial-client-shipra-tyagi.jpg",
    initials: "ST",
    review:
      "Dr. Hardeep is genuinely the best vet we could have asked for our dog, Macxo. He was the one who accurately discovered Macxo had a tumor and performed his surgery with utmost precision. His calm reassurance and surgical expertise guided us through a very difficult phase.",
  },
  {
    id: "rishu",
    author: "Rishu Singh",
    pet: "Parent to Misthi",
    serviceTag: "Critical Care & Spleenectomy",
    rating: 5,
    avatar: "/images/testimonial-client-rishu-singh.jpg",
    initials: "RS",
    review:
      "I am incredibly grateful to the team at AVC Hospital for the exceptional care they provided to my female dog Misthi during her spleenectomy. From the moment we arrived, the ICU staff were compassionate, professional, and prepped to save her life.",
  },
  {
    id: "pramod",
    author: "Pramod Sehgal",
    pet: "Parent to Ziva • Feline Care",
    serviceTag: "Chronic Feline Dermatology",
    rating: 5,
    avatar: "/images/testimonial-client-pramod-sehgal.jpg",
    initials: "PS",
    review:
      "I had an excellent experience at AVC Multispeciality Pet Hospital. A special thanks to Dr. Hardeep for treating my cat, Ziva, who was suffering from a persistent skin problem for over a year. His accurate diagnosis cured her completely when others couldn't.",
  },
  {
    id: "chitresh",
    author: "Chitresh Mittal",
    pet: "Parent to Kuchi • Shih Tzu",
    serviceTag: "Accurate Diagnosis & Cure",
    rating: 5,
    avatar: "/images/testimonial-client-chitresh-mittal.png",
    initials: "CM",
    review:
      "Thanks to AVC Hospital and Dr. Hardeep for helping my Kuchi. Over the past year, his accurate diagnoses and treatments have cured her problems. The staff are compassionate pet lovers, and the hospital is remarkably clean and well-maintained.",
  },
  {
    id: "gopa",
    author: "Gopa Ghoshal",
    pet: "Parent to Rambo & Alex • Golden Retrievers",
    serviceTag: "Pet Boarding & Daycare",
    rating: 5,
    avatar: "/images/testimonial-client-gopa-ghosal.png",
    initials: "GG",
    review:
      "AVC PET Boarding is a second home for my pets, Rambo and Alex. We are completely relaxed having it next to our society whenever we travel. They are always excited to meet their buddies Gullack, Simha, and Junior. Highly recommended for boarding and daycare in Gurgaon!",
  },
  {
    id: "sonu",
    author: "Sonu Balu",
    pet: "Parent to Bruno • German Shepherd",
    serviceTag: "24/7 Trauma Emergency",
    rating: 5,
    avatar: "/images/testimonial-client-sonu-balu.png",
    initials: "SB",
    review:
      "Animates Vet Care (AVC) Hospital in Gurugram offers exceptional multispecialty pet care. When Bruno needed urgent late-night emergency stabilization, Dr. Hardeep Beniwal and the ICU staff attended immediately with zero delay. Real peace of mind.",
  },
];

export const Testimonials: React.FC = () => {
  return (
    <section className={styles.section} id="testimonials">
      <Container>
        {/* Header with Google Trust Proof Anchor */}
        <div className={styles.header}>
          <div className={styles.googleTrustPill}>
            {GOOGLE_G_ICON}
            <div className={styles.starRowMini}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={13} className={styles.starFill} fill="#f59e0b" />
              ))}
            </div>
            <span className={styles.googleScore}>4.8 / 5.0</span>
            <span className={styles.googleDivider}>•</span>
            <span className={styles.googleCount}>700+ Verified Google Reviews</span>
          </div>

          <h2 className={styles.title}>
            Real stories from families who trust us with their pets.
          </h2>
          <p className={styles.subtitle}>
            Verified patient reviews from Google Maps for Dr. Hardeep Beniwal and the AVC veterinary team in Gurugram.
          </p>
        </div>

        {/* 3-Column Minimal Editorial Review Cards */}
        <div className={styles.grid}>
          {REAL_GOOGLE_REVIEWS.map((item) => (
            <div key={item.id} className={styles.card}>
              {/* Card Top: Service Tag + 5 Stars */}
              <div className={styles.cardTop}>
                <span className={styles.serviceTag}>{item.serviceTag}</span>
                <div className={styles.starsRow} aria-label={`${item.rating} out of 5 stars`}>
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} size={14} className={styles.starSvg} fill="#f59e0b" />
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <p className={styles.reviewText}>&ldquo;{item.review}&rdquo;</p>

              {/* Card Bottom: Author Info + Google Verified Badge */}
              <div className={styles.authorRow}>
                <div className={styles.authorProfile}>
                  <Image
                    src={item.avatar}
                    alt={item.author}
                    width={42}
                    height={42}
                    className={styles.avatarImg}
                  />
                  <div className={styles.authorMeta}>
                    <h4 className={styles.authorName}>{item.author}</h4>
                    <span className={styles.petInfo}>{item.pet}</span>
                  </div>
                </div>

                <div className={styles.verifiedBadge} title="Verified Google Review">
                  {GOOGLE_G_ICON}
                  <CheckCircle2 size={12} className={styles.checkIcon} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Social Proof Bar */}
        <div className={styles.bottomBar}>
          <div className={styles.bottomInfo}>
            <span className={styles.hospitalNote}>
              Rated 4.8 / 5.0 across Sector 90 Multi-Speciality Hospital &amp; Sector 87 Pet World
            </span>
          </div>

          <a
            href="https://maps.google.com/?q=AVC+Multispeciality+Pet+Hospital+Sector+90+Gurugram"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.googleMapsBtn}
          >
            <span>Read all 700+ Google Reviews</span>
            <ExternalLink size={14} aria-hidden="true" />
          </a>
        </div>
      </Container>
    </section>
  );
};
