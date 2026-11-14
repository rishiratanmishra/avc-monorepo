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
  LayoutGrid,
  Kanban,
  HeartPulse,
  Activity,
  Cpu,
  Stethoscope,
  Cat,
  Home,
  Check,
  PhoneCall,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  MapPin,
} from "lucide-react";
import styles from "./services-catalog.module.css";

interface ServiceHighlightConfig {
  shortTitle: string;
  tagline: string;
  highlights: [string, string, string];
  ctaText: string;
  ctaHref: string;
  isEmergency?: boolean;
}

const SERVICE_CONFIGS: Record<string, ServiceHighlightConfig> = {
  "emergency-icu": {
    shortTitle: "24/7 Emergency & ICU",
    tagline: "Immediate life-saving resuscitation and continuous oxygen therapy.",
    highlights: [
      "24/7 on-site emergency veterinary surgeons",
      "Temperature-controlled oxygenation kennels",
      "Emergency blood transfusion & trauma ICU",
    ],
    ctaText: "Call 24/7 ICU: +91 99900 70026",
    ctaHref: "tel:+919990070026",
    isEmergency: true,
  },
  "surgical-services": {
    shortTitle: "Surgeries & Modular OT",
    tagline: "Positive-pressure sterile operating suites for complex procedures.",
    highlights: [
      "Cruciate ligament & fracture bone repair",
      "Minimally invasive laparoscopic spaying",
      "Precision Isoflurane gas anesthesia monitoring",
    ],
    ctaText: "Schedule Surgical Consult",
    ctaHref: "/#contact",
  },
  "diagnostic-pathology": {
    shortTitle: "Diagnostics & Labs",
    tagline: "Rapid in-house IDEXX lab reports and digital radiology in 15 minutes.",
    highlights: [
      "15-min CBC, biochemistry & electrolytes",
      "High-frequency digital X-Ray (DR System)",
      "High-resolution color Doppler ultrasound",
    ],
    ctaText: "Book Diagnostic Lab Test",
    ctaHref: "/#contact",
  },
  "cat-care-opd": {
    shortTitle: "Cat Care OPD & Feline Suite",
    tagline: "Fear-free, canine-isolated acoustic suites tailored for cats.",
    highlights: [
      "Acoustically isolated dog-free consultation",
      "Continuous Feliway calming pheromones",
      "Specialized feline urinary & kidney care",
    ],
    ctaText: "Book Cat Care Consult",
    ctaHref: "/#contact",
  },
  "opd-preventive": {
    shortTitle: "OPD & Preventive Health",
    tagline: "Comprehensive nose-to-tail wellness exams and vaccination plans.",
    highlights: [
      "Complete physical health checkups",
      "Puppy & kitten core vaccination schedules",
      "Dermatology, hot-spots & allergy care",
    ],
    ctaText: "Book OPD Appointment",
    ctaHref: "/#contact",
  },
  "pet-boarding-resort": {
    shortTitle: "Luxury Boarding & Daycare",
    tagline: "Cage-free climate-controlled suites, splash pool, and agility park.",
    highlights: [
      "Private air-conditioned suites with CCTV",
      "Filtered splash pool & grass play park",
      "24/7 on-site veterinary supervision",
    ],
    ctaText: "Reserve Resort Suite",
    ctaHref: "tel:+919990070027",
  },
  "grooming-spa": {
    shortTitle: "Pet Grooming & Spa",
    tagline: "Certified therapeutic medicated baths, breed styling, and coat care.",
    highlights: [
      "Medicated anti-tick & fungal baths",
      "Breed-standard scissoring & styling",
      "Hydrotherapy tubs & low-noise drying",
    ],
    ctaText: "Book Grooming Session",
    ctaHref: "tel:+919990070027",
  },
  "pharmacy-products": {
    shortTitle: "24/7 Veterinary Pharmacy",
    tagline: "Round-the-clock prescription medications, injectables, and clinical diets.",
    highlights: [
      "24/7 emergency medicines & antibiotics",
      "Therapeutic prescription diets (Royal Canin, Hills)",
      "Cold-chain temperature-controlled vaccines",
    ],
    ctaText: "Contact Pharmacy: +91 99900 70026",
    ctaHref: "tel:+919990070026",
  },
  "dental-oral-care": {
    shortTitle: "Veterinary Dental Suite",
    tagline: "Ultrasonic tartar scaling, dental polishing, and extractions under anesthesia.",
    highlights: [
      "Piezo ultrasonic plaque & tartar removal",
      "Monitored inhalation gas anesthesia",
      "Infected tooth extractions & stomatitis care",
    ],
    ctaText: "Book Dental Checkup",
    ctaHref: "/#contact",
  },
};

const KANBAN_DEPARTMENTS = [
  {
    id: "emergency",
    label: "24/7 Emergency & ICU",
    campus: "Sector 90 Hospital · 24/7",
    color: "#ba1a1a",
  },
  {
    id: "surgery",
    label: "Surgeries & Modular OT",
    campus: "Sector 90 Hospital",
    color: "#1b75bb",
  },
  {
    id: "diagnostics",
    label: "Diagnostics & Labs",
    campus: "Sector 90 In-House Lab",
    color: "#0891b2",
  },
  {
    id: "wellness",
    label: "OPD & Preventive",
    campus: "Both Campuses (Sec 90 & 87)",
    color: "#0d9488",
  },
  {
    id: "feline",
    label: "Cat Care OPD",
    campus: "Sector 90 Feline Wing",
    color: "#7c3aed",
  },
  {
    id: "resort",
    label: "Boarding & Spa Resort",
    campus: "Sector 87 Pet World",
    color: "#d97706",
  },
] as const;

const getCategoryIcon = (id: string) => {
  switch (id) {
    case "all":
      return LayoutGrid;
    case "emergency":
      return HeartPulse;
    case "surgery":
      return Activity;
    case "diagnostics":
      return Cpu;
    case "wellness":
      return Stethoscope;
    case "feline":
      return Cat;
    case "resort":
      return Home;
    default:
      return LayoutGrid;
  }
};

const getServiceIcon = (id: string) => {
  switch (id) {
    case "emergency-icu":
      return HeartPulse;
    case "surgical-services":
      return Activity;
    case "diagnostic-pathology":
      return Cpu;
    case "cat-care-opd":
      return Cat;
    case "opd-preventive":
      return Stethoscope;
    case "pet-boarding-resort":
      return Home;
    case "grooming-spa":
      return Sparkles;
    case "pharmacy-products":
      return ShieldCheck;
    case "dental-oral-care":
      return Sparkles;
    default:
      return Stethoscope;
  }
};

export const ServicesCatalog: React.FC = () => {
  const [viewMode, setViewMode] = useState<"grid" | "kanban">("kanban");
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
          <span className={styles.eyebrow}>Clinical Departments &amp; Specialties</span>

          <h2 id="catalog-title" className={styles.title}>
            Explore Our <span className={styles.titleHighlight}>Comprehensive Services</span>
          </h2>

          <p className={styles.description}>
            From life-saving trauma surgery and rapid 15-minute diagnostic pathology to specialized feline OPD and luxury pet resort boarding in Gurugram.
          </p>
        </div>

        {/* View Switcher Controls (Grid View vs Kanban Board) */}
        <div className={styles.controlsBar}>
          <div className={styles.viewToggleGroup} role="group" aria-label="Layout view mode">
            <button
              type="button"
              className={`${styles.viewBtn} ${viewMode === "kanban" ? styles.viewBtnActive : ""}`}
              onClick={() => setViewMode("kanban")}
              aria-pressed={viewMode === "kanban"}
            >
              <Kanban size={15} aria-hidden="true" />
              <span>Kanban Board</span>
              <span className={styles.popularBadge}>New</span>
            </button>

            <button
              type="button"
              className={`${styles.viewBtn} ${viewMode === "grid" ? styles.viewBtnActive : ""}`}
              onClick={() => setViewMode("grid")}
              aria-pressed={viewMode === "grid"}
            >
              <LayoutGrid size={15} aria-hidden="true" />
              <span>Grid View</span>
            </button>
          </div>

          <div className={styles.controlsHint}>
            {viewMode === "kanban" ? (
              <span>
                <strong>6 Department Lanes</strong> · Scroll or swipe horizontally to explore all specialties
              </span>
            ) : (
              <span>
                Showing <strong>{filteredServices.length}</strong> {filteredServices.length === 1 ? "specialty" : "specialties"}
              </span>
            )}
          </div>
        </div>

        {/* 1. GRID VIEW MODE */}
        {viewMode === "grid" && (
          <>
            {/* Modern Segmented Department Rail */}
            <div className={styles.segmentedFilterWrapper}>
              <div className={styles.segmentedRail} role="tablist" aria-label="Department Categories">
                {SERVICE_CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  const IconComp = getCategoryIcon(cat.id);
                  const count =
                    cat.id === "all"
                      ? DETAILED_SERVICES.length
                      : DETAILED_SERVICES.filter((s) => s.category === cat.id).length;

                  return (
                    <button
                      key={cat.id}
                      role="tab"
                      aria-selected={isActive}
                      className={`${styles.segmentedTab} ${isActive ? styles.segmentedTabActive : ""}`}
                      onClick={() => setSelectedCategory(cat.id as ServiceCategory)}
                    >
                      <IconComp size={15} className={styles.tabIcon} aria-hidden="true" />
                      <span className={styles.tabLabel}>{cat.label}</span>
                      <span className={styles.tabCount}>{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Standard 3-Column Grid */}
            <div className={styles.grid}>
              {filteredServices.map((service) => {
                const config = SERVICE_CONFIGS[service.id];
                const IconComponent = getServiceIcon(service.id);
                const isEmergency = config?.isEmergency || service.id === "emergency-icu";

                return (
                  <article key={service.id} className={styles.card}>
                    <div className={styles.mediaHeader}>
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className={styles.mediaImage}
                      />
                      <span className={styles.campusBadge}>{service.campus}</span>
                      {isEmergency && (
                        <span className={styles.emergencyBadge}>
                          <span className={styles.livePulseDot} aria-hidden="true" />
                          24/7 Walk-in
                        </span>
                      )}
                    </div>

                    <div className={styles.cardBody}>
                      <div className={styles.titleRow}>
                        <div className={styles.titleIcon}>
                          <IconComponent size={18} aria-hidden="true" />
                        </div>
                        <h3 className={styles.cardTitle}>
                          {config?.shortTitle || service.title}
                        </h3>
                      </div>

                      <p className={styles.cardTagline}>
                        {config?.tagline || service.subtitle}
                      </p>

                      <div className={styles.highlightsBox}>
                        <span className={styles.highlightsHeader}>Key Capabilities:</span>
                        <ul className={styles.highlightsList}>
                          {(config?.highlights || service.whatWeTreat.slice(0, 3)).map((item, idx) => (
                            <li key={idx} className={styles.highlightItem}>
                              <Check size={14} className={styles.checkIcon} aria-hidden="true" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className={styles.cardFooter}>
                      {isEmergency ? (
                        <a
                          href={config?.ctaHref || `tel:${service.phone.replace(/\s+/g, "")}`}
                          className={styles.emergencyBtn}
                        >
                          <PhoneCall size={14} aria-hidden="true" />
                          <span>{config?.ctaText || service.ctaLabel}</span>
                        </a>
                      ) : (
                        <Link
                          href={config?.ctaHref || "/#contact"}
                          className={styles.actionBtn}
                        >
                          <span>{config?.ctaText || "Book Consultation"}</span>
                          <ArrowUpRight size={14} aria-hidden="true" />
                        </Link>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}

        {/* 2. KANBAN BOARD VIEW MODE */}
        {viewMode === "kanban" && (
          <div className={styles.kanbanWrapper}>
            <div className={styles.kanbanBoard} role="region" aria-label="Department Kanban Board">
              {KANBAN_DEPARTMENTS.map((dept) => {
                const deptServices = DETAILED_SERVICES.filter(
                  (s) => s.category === dept.id
                );
                const DeptIcon = getCategoryIcon(dept.id);

                return (
                  <div key={dept.id} className={styles.kanbanLane}>
                    {/* Lane Header */}
                    <div className={styles.laneHeader}>
                      <div className={styles.laneTitleArea}>
                        <div className={styles.laneIconWrap}>
                          <DeptIcon size={16} aria-hidden="true" />
                        </div>
                        <div>
                          <h3 className={styles.laneTitle}>{dept.label}</h3>
                          <span className={styles.laneCampus}>
                            <MapPin size={11} aria-hidden="true" />
                            {dept.campus}
                          </span>
                        </div>
                      </div>
                      <span className={styles.laneCountBadge}>
                        {deptServices.length}
                      </span>
                    </div>

                    {/* Lane Cards Stack */}
                    <div className={styles.laneCardStack}>
                      {deptServices.map((service) => {
                        const config = SERVICE_CONFIGS[service.id];
                        const isEmergency = config?.isEmergency || service.id === "emergency-icu";

                        return (
                          <article key={service.id} className={styles.kanbanCard}>
                            {/* Card Media Header */}
                            <div className={styles.kanbanMediaHeader}>
                              <Image
                                src={service.image}
                                alt={service.title}
                                fill
                                sizes="320px"
                                className={styles.mediaImage}
                              />
                              {isEmergency && (
                                <span className={styles.emergencyBadge}>
                                  <span className={styles.livePulseDot} aria-hidden="true" />
                                  24/7 Available
                                </span>
                              )}
                            </div>

                            {/* Card Body */}
                            <div className={styles.kanbanCardBody}>
                              <h4 className={styles.kanbanCardTitle}>
                                {config?.shortTitle || service.title}
                              </h4>

                              <p className={styles.kanbanCardTagline}>
                                {config?.tagline || service.subtitle}
                              </p>

                              {/* 3 Glanceable Highlights */}
                              <div className={styles.kanbanHighlights}>
                                <ul className={styles.highlightsList}>
                                  {(config?.highlights || service.whatWeTreat.slice(0, 3)).map((item, idx) => (
                                    <li key={idx} className={styles.highlightItem}>
                                      <Check size={13} className={styles.checkIcon} aria-hidden="true" />
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            {/* Card Action */}
                            <div className={styles.kanbanCardFooter}>
                              {isEmergency ? (
                                <a
                                  href={config?.ctaHref || `tel:${service.phone.replace(/\s+/g, "")}`}
                                  className={styles.emergencyBtn}
                                >
                                  <PhoneCall size={14} aria-hidden="true" />
                                  <span>{config?.ctaText || "Call 24/7 ICU"}</span>
                                </a>
                              ) : (
                                <Link
                                  href={config?.ctaHref || "/#contact"}
                                  className={styles.actionBtn}
                                >
                                  <span>{config?.ctaText || "Book Visit"}</span>
                                  <ChevronRight size={14} aria-hidden="true" />
                                </Link>
                              )}
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
};
