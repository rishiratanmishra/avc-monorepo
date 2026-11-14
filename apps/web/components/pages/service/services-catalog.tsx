"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "../../layout/container";
import {
  SERVICE_CATEGORIES,
  DETAILED_SERVICES,
} from "../../../constants/services-info";
import type { ServiceCategory } from "../../../types";
import {
  Check,
  Cpu,
  MapPin,
  PhoneCall,
  Sparkles,
  Stethoscope,
  Filter,
} from "lucide-react";
import styles from "./services-catalog.module.css";

export const ServicesCatalog: React.FC = () => {
  const [selectedCategory, setSelectedCategory] =
    useState<ServiceCategory>("all");

  const filteredServices =
    selectedCategory === "all"
      ? DETAILED_SERVICES
      : DETAILED_SERVICES.filter((s) => s.category === selectedCategory);

  return (
    <section className={styles.section} id="services-catalog" aria-labelledby="catalog-title">
      <Container>
        {/* Section Heading */}
        <div className={styles.header}>
          <div className={styles.tagWrap}>
            <Stethoscope className={styles.tagIcon} size={16} />
            <span>Clinical Departments & Specialties</span>
          </div>

          <h2 id="catalog-title" className={styles.title}>
            Explore Our <span className={styles.titleHighlight}>Comprehensive Services</span>
          </h2>

          <p className={styles.description}>
            From life-saving trauma surgery and rapid 15-minute diagnostic pathology to specialized feline OPD and luxury pet resort boarding in Gurugram.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className={styles.filterContainer}>
          <div className={styles.filterHeader}>
            <div className={styles.filterLabel}>
              <Filter size={15} />
              <span>Filter by Department:</span>
            </div>
            <span className={styles.counterBadge}>
              Showing {filteredServices.length} {filteredServices.length === 1 ? "Department" : "Departments"}
            </span>
          </div>

          <div className={styles.pillList} role="tablist" aria-label="Service categories">
            {SERVICE_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  role="tab"
                  aria-selected={isActive}
                  className={`${styles.pillBtn} ${isActive ? styles.pillBtnActive : ""}`}
                  onClick={() => setSelectedCategory(cat.id as ServiceCategory)}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Services Grid */}
        <div className={styles.grid}>
          {filteredServices.map((service) => (
            <div key={service.id} className={styles.serviceCard}>
              {/* Card Image Banner */}
              <div className={styles.imageWrapper}>
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className={styles.cardImage}
                />
                <div className={styles.imageScrim} />

                <div className={styles.imageTopRow}>
                  {service.badge && (
                    <span className={styles.statusBadge}>
                      <Sparkles size={13} />
                      <span>{service.badge}</span>
                    </span>
                  )}
                  <span className={styles.campusBadge}>
                    <MapPin size={13} />
                    <span>{service.campus}</span>
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className={styles.cardBody}>
                <div className={styles.headerGroup}>
                  <span className={styles.serviceSubtitle}>{service.subtitle}</span>
                  <h3 className={styles.serviceTitle}>{service.title}</h3>
                </div>

                <p className={styles.serviceDesc}>{service.description}</p>

                {/* What We Treat Checklist */}
                <div className={styles.treatBox}>
                  <h4 className={styles.boxTitle}>Clinical Conditions & Procedures Treated</h4>
                  <ul className={styles.treatList}>
                    {service.whatWeTreat.map((item, idx) => (
                      <li key={idx} className={styles.treatItem}>
                        <div className={styles.checkWrap} aria-hidden="true">
                          <Check size={12} strokeWidth={2.5} />
                        </div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Equipment / Technology Tags */}
                <div className={styles.techBox}>
                  <div className={styles.techHeader}>
                    <Cpu size={14} className={styles.techIcon} />
                    <span className={styles.techTitle}>On-Site Technology & Standards</span>
                  </div>
                  <div className={styles.tagGroup}>
                    {service.equipmentAndTech.map((tech, idx) => (
                      <span key={idx} className={styles.techTag}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Row */}
                <div className={styles.actionRow}>
                  <a
                    href={`tel:${service.phone.replace(/\s+/g, "")}`}
                    className={styles.callBtn}
                  >
                    <PhoneCall size={15} />
                    <span>{service.ctaLabel}</span>
                  </a>

                  <Link href="/#contact" className={styles.bookBtn}>
                    <span>Book Online</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
