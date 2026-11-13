import React from "react";
import { Container } from "../layout/container";
import { Badge } from "../ui/badge";
import { TESTIMONIALS } from "../../constants";
import styles from "./testimonials.module.css";

export const Testimonials: React.FC = () => {
  return (
    <section className={styles.section} id="testimonials">
      <Container>
        <div className={styles.header}>
          <Badge variant="teal">Pet Parent Reviews</Badge>
          <h2 className={styles.title}>What Pet Parents Say About Us</h2>
          <p className={styles.subtitle}>
            Read genuine experiences from pet families who trust AVC Hospital and Luxury Pet Resort.
          </p>
        </div>

        <div className={styles.grid}>
          {TESTIMONIALS.map((item) => (
            <div key={item.id} className={styles.card}>
              <div>
                <div className={styles.stars}>★★★★★</div>
                <p className={styles.review}>&ldquo;{item.review}&rdquo;</p>
              </div>

              <div className={styles.authorRow}>
                <img
                  src={item.avatar}
                  alt={item.author}
                  className={styles.avatar}
                  loading="lazy"
                />
                <div>
                  <h4 className={styles.authorName}>{item.author}</h4>
                  {item.pet && <span className={styles.petInfo}>{item.pet}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
