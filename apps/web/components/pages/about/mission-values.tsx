import React from "react";
import { Container } from "../../layout/container";
import { VALUE_PILLARS } from "../../../constants/about-info";
import { Sparkles, CheckCircle2 } from "lucide-react";
import styles from "./mission-values.module.css";

export const MissionValues: React.FC = () => {
  return (
    <section className={styles.section} id="mission-values" aria-labelledby="mission-title">
      <Container>
        <div className={styles.header}>
          <div className={styles.tagWrap}>
            <Sparkles className={styles.tagIcon} size={16} />
            <span className={styles.tagText}>Our Guiding Philosophy</span>
          </div>

          <h2 id="mission-title" className={styles.title}>
            Veterinary Standards Built on <span className={styles.titleHighlight}>Trust & Empathy</span>
          </h2>

          <p className={styles.description}>
            We reject the idea that animal hospitals must feel intimidating or impersonal. Every protocol at AVC is engineered to bring hospital-grade medical precision into a soothing, compassionate environment.
          </p>
        </div>

        <div className={styles.grid}>
          {VALUE_PILLARS.map((pillar) => (
            <div key={pillar.id} className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.iconCircle} aria-hidden="true">
                  <span className={styles.iconEmoji}>{pillar.icon}</span>
                </div>
                {pillar.badge && (
                  <span className={styles.cardBadge}>
                    <CheckCircle2 size={13} className={styles.checkIcon} />
                    {pillar.badge}
                  </span>
                )}
              </div>

              <div className={styles.cardContent}>
                <span className={styles.pillarSubtitle}>{pillar.subtitle}</span>
                <h3 className={styles.pillarTitle}>{pillar.title}</h3>
                <p className={styles.pillarDesc}>{pillar.description}</p>
              </div>

              <div className={styles.cardFooter}>
                <span className={styles.indicatorBar} />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
