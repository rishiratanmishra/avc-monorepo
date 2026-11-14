"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Container } from "../../layout/container";
import { FACILITIES_SHOWCASE } from "../../../constants/about-info";
import type { FacilityDetail } from "../../../types";
import { Check } from "lucide-react";
import styles from "./facilities-showcase.module.css";

export const FacilitiesShowcase: React.FC = () => {
  const initialFacility = FACILITIES_SHOWCASE[0] as FacilityDetail;
  const [activeTab, setActiveTab] = useState<string>(initialFacility.id);

  const activeFacility: FacilityDetail =
    FACILITIES_SHOWCASE.find((f) => f.id === activeTab) || initialFacility;

  return (
    <section className={styles.section} id="facilities" aria-labelledby="facilities-title">
      <Container>
        <div className={styles.header}>
          <span className={styles.eyebrow}>Facilities</span>

          <h2 id="facilities-title" className={styles.title}>
            Hospital facilities
          </h2>

          <p className={styles.description}>
            A look at the treatment, diagnostic, critical care, and boarding spaces at AVC.
          </p>
        </div>

        <div className={styles.tabList} role="tablist" aria-label="Hospital facilities">
          {FACILITIES_SHOWCASE.map((item) => {
            const isSelected = item.id === activeTab;
            return (
              <button
                key={item.id}
                role="tab"
                aria-selected={isSelected}
                aria-controls={`facility-panel-${item.id}`}
                id={`facility-tab-${item.id}`}
                className={`${styles.tabBtn} ${isSelected ? styles.tabBtnActive : ""}`}
                onClick={() => setActiveTab(item.id)}
                type="button"
              >
                <span className={styles.tabTitle}>{item.title}</span>
                <span className={styles.tabBadge}>{item.campus}</span>
              </button>
            );
          })}
        </div>

        <div
          id={`facility-panel-${activeFacility.id}`}
          role="tabpanel"
          aria-labelledby={`facility-tab-${activeFacility.id}`}
          className={styles.panel}
        >
          <div className={styles.panelGrid}>
            <div className={styles.imageCol}>
              <div className={styles.imageFrame}>
                <Image
                  src={activeFacility.image}
                  alt={activeFacility.title}
                  width={640}
                  height={420}
                  className={styles.facilityImage}
                />
              </div>
              <p className={styles.facilityCampus}>{activeFacility.campus}</p>
            </div>

            <div className={styles.detailsCol}>
              <span className={styles.facilitySubtitle}>{activeFacility.subtitle}</span>
              <h3 className={styles.facilityTitle}>{activeFacility.title}</h3>
              <p className={styles.facilityDesc}>{activeFacility.description}</p>

              <div className={styles.highlightsBox}>
                <h4 className={styles.highlightsHeading}>Facilities include</h4>
                <ul className={styles.highlightsList}>
                  {activeFacility.highlights.map((h, idx) => (
                    <li key={idx} className={styles.highlightItem}>
                      <span className={styles.checkWrap}>
                        <Check size={14} className={styles.checkSvg} />
                      </span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
