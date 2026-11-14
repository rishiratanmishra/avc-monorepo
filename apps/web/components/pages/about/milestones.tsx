import React from "react";
import { Container } from "../../layout/container";
import { MILESTONES_TIMELINE } from "../../../constants/about-info";
import { History, Award, CheckCircle } from "lucide-react";
import styles from "./milestones.module.css";

export const Milestones: React.FC = () => {
  return (
    <section className={styles.section} id="milestones" aria-labelledby="milestones-title">
      <Container>
        <div className={styles.header}>
          <div className={styles.tagWrap}>
            <History className={styles.tagIcon} size={16} />
            <span>Growth & Heritage</span>
          </div>

          <h2 id="milestones-title" className={styles.title}>
            Our Journey of <span className={styles.titleHighlight}>Excellence & Care</span>
          </h2>

          <p className={styles.description}>
            From humble clinical beginnings to Gurugram’s foremost 24/7 multispeciality veterinary hospital and luxury pet resort.
          </p>
        </div>

        {/* Timeline Component */}
        <div className={styles.timeline}>
          {MILESTONES_TIMELINE.map((item, index) => (
            <div key={index} className={styles.timelineItem}>
              {/* Timeline Connector Line & Dot */}
              <div className={styles.nodeColumn}>
                <div className={styles.nodeCircle}>
                  <CheckCircle size={16} className={styles.nodeIcon} />
                </div>
                {index !== MILESTONES_TIMELINE.length - 1 && (
                  <div className={styles.lineSegment} />
                )}
              </div>

              {/* Content Card */}
              <div className={styles.timelineCard}>
                <div className={styles.cardHeader}>
                  <span className={styles.yearBadge}>{item.year}</span>
                  {item.badge && (
                    <span className={styles.categoryBadge}>
                      <Award size={12} />
                      {item.badge}
                    </span>
                  )}
                </div>
                <h3 className={styles.itemTitle}>{item.title}</h3>
                <p className={styles.itemDesc}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
