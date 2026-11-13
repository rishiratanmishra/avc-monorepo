"use client";

import React, { useRef } from "react";
import { Container } from "../layout/container";
import { CORE_SERVICES } from "../../constants";
import styles from "./services.module.css";

const TICKER_ITEMS = [
  "Boarding",
  "OPD",
  "ICU",
  "X-Ray",
  "IDEXX Laboratories",
  "Surgery",
  "Medical Boarding",
  "Daycare Boarding",
  "Grooming",
  "Emergency Care",
  "Vaccination",
  "Pharmacy",
];

export const Services: React.FC = () => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 398; // card width (370px) + gap (28px)
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className={styles.section} id="services">
      <Container>
        {/* Header with Title and Carousel Controls */}
        <div className={styles.topRow}>
          <div className={styles.titleArea}>
            <div className={styles.pill}>
              <span className={styles.pawIcon}>🐾</span>
              <span>OUR SERVICES</span>
            </div>
            <h2 className={styles.title}>Advanced Pet Care Options</h2>
          </div>

          <div className={styles.controls}>
            <button
              type="button"
              className={styles.controlBtn}
              onClick={() => scroll("left")}
              aria-label="Previous service"
            >
              &#8249;
            </button>
            <button
              type="button"
              className={styles.controlBtn}
              onClick={() => scroll("right")}
              aria-label="Next service"
            >
              &#8250;
            </button>
          </div>
        </div>

        {/* Carousel Track with Image Cards */}
        <div className={styles.carousel} ref={carouselRef}>
          {CORE_SERVICES.map((service) => (
            <div key={service.id} className={styles.card}>
              {/* Visual wrapper with the exact corner notch clip-path */}
              <div className={styles.cardVisual}>
                {service.image && (
                  <img
                    src={service.image}
                    alt={service.title}
                    className={styles.cardImage}
                    loading="lazy"
                  />
                )}
                {/* Blue Gradient Overlay */}
                <div className={styles.cardGradient} />
              </div>

              {/* Card Bottom Content */}
              <div className={styles.cardContent}>
                <span className={styles.cardCategory}>PET CARE</span>
                <h3 className={styles.cardTitle}>{service.title}</h3>
              </div>

              {/* Circular Action Button nested in the corner scoop */}
              <div className={styles.actionBtn}>
                <span className={styles.actionArrow}>&#8599;</span>
              </div>
            </div>
          ))}
        </div>
      </Container>

      {/* Running Marquee Ticker */}
      <div className={styles.tickerWrap}>
        <div className={styles.tickerContent}>
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
            <span key={idx} className={styles.tickerItem}>
              {item}
              <span className={styles.tickerStar}>✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
