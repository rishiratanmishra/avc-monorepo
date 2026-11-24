"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "../../../components/layout/header";
import { Footer } from "../../../components/layout/footer";
import { Container } from "../../../components/layout/container";
import { useAuth } from "../../../contexts/auth-context";
import {
  Sparkles,
  Home,
  CheckCircle2,
  Clock,
  Camera,
  Bath,
  Sun,
  ShieldCheck,
  Check,
} from "lucide-react";
import styles from "./staff.module.css";

const SUITES = [
  { suite: "Suite 01", pet: "Rambo", breed: "Labrador", status: "Occupied", diet: "Royal Canin Gastro · 2x daily", notes: "Loves tennis ball fetch in Yard A" },
  { suite: "Suite 02", pet: "Alex", breed: "Beagle", status: "Occupied", diet: "Hills Sensitive Skin · Medicated", notes: "Ear drops at 5:00 PM" },
  { suite: "Suite 03", pet: "Gullack", breed: "Indie Dog", status: "Occupied", diet: "Boiled chicken + pumpkin broth", notes: "Afternoon splash pool session" },
  { suite: "Suite 04", pet: "—", breed: "—", status: "Sanitized & Empty", diet: "—", notes: "Ready for evening check-in" },
];

export default function StaffPortal() {
  const { user } = useAuth();
  const [feedChecked, setFeedChecked] = useState<Record<string, boolean>>({
    Rambo: true,
    Alex: false,
    Gullack: true,
  });

  return (
    <>
      <Header />
      <main className={styles.main}>
        <Container>
          <div className={styles.topBar}>
            <div>
              <span className={styles.roleBadge}>Pet Resort &amp; Daycare Staff Board</span>
              <h1 className={styles.title}>
                {user?.name || "Vikram Singh"} — Sector 87 Pet World
              </h1>
              <p className={styles.sub}>
                Luxury cage-free suites, feeding &amp; medication logs, grooming spa, and play sessions.
              </p>
            </div>

            <button
              type="button"
              onClick={() => alert("WhatsApp update sent to pet parents!")}
              className={styles.updateParentsBtn}
            >
              <Camera size={14} />
              <span>Send WhatsApp Photos</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <span className={styles.mLabel}>Suite Occupancy</span>
              <span className={styles.mValue}>3 / 4 Occupied</span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.mLabel}>Daycare Dogs Active</span>
              <span className={styles.mValue}>8 in Agility Yard</span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.mLabel}>Grooming Spa Queue</span>
              <span className={styles.mValueSuccess}>2 Medicated Baths</span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.mLabel}>CCTV Streaming Status</span>
              <span className={styles.mValueAlert}>All 12 Cameras Live</span>
            </div>
          </div>

          <div className={styles.grid}>
            {/* Left: Luxury Suites */}
            <div className={styles.mainCol}>
              <div className={styles.panelCard}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>Sector 87 Luxury Private Suites</h2>
                  <span className={styles.campusTag}>Climate Controlled</span>
                </div>

                <div className={styles.suitesGrid}>
                  {SUITES.map((st) => (
                    <div key={st.suite} className={styles.suiteCard}>
                      <div className={styles.suiteHead}>
                        <span className={styles.suiteNo}>{st.suite}</span>
                        <span
                          className={
                            st.status === "Occupied"
                              ? styles.occupiedPill
                              : styles.emptyPill
                          }
                        >
                          {st.status}
                        </span>
                      </div>
                      <h3 className={styles.suitePet}>{st.pet}</h3>
                      <span className={styles.suiteBreed}>{st.breed}</span>
                      <p className={styles.suiteDiet}>
                        <strong>Diet:</strong> {st.diet}
                      </p>
                      <p className={styles.suiteNotes}>
                        <strong>Notes:</strong> {st.notes}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feeding & Medication Checklist */}
              <div className={styles.panelCard}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>Daily Feeding &amp; Medication Checklist</h2>
                  <span className={styles.campusTag}>Evening Round</span>
                </div>

                <div className={styles.checklist}>
                  {Object.keys(feedChecked).map((petName) => {
                    const isDone = feedChecked[petName];
                    return (
                      <div key={petName} className={styles.checkItem}>
                        <button
                          type="button"
                          className={`${styles.checkbox} ${
                            isDone ? styles.checkboxChecked : ""
                          }`}
                          onClick={() =>
                            setFeedChecked({
                              ...feedChecked,
                              [petName]: !isDone,
                            })
                          }
                          aria-label={`Toggle feeding for ${petName}`}
                        >
                          {isDone && <Check size={14} />}
                        </button>

                        <div className={styles.checkText}>
                          <span className={styles.checkPetName}>{petName}</span>
                          <span className={styles.checkSub}>
                            {petName === "Alex"
                              ? "Hills Prescription Skin Food + 5:00 PM Ear Drops"
                              : "Wholesome diet meal complete"}
                          </span>
                        </div>

                        <span
                          className={isDone ? styles.doneTag : styles.pendingTag}
                        >
                          {isDone ? "Completed" : "Pending"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Grooming & Pool Schedule */}
            <div className={styles.sideCol}>
              <div className={styles.sideCard}>
                <div className={styles.sideCardHead}>
                  <Bath size={18} className={styles.bathIcon} />
                  <h3 className={styles.sideTitle}>Grooming Spa Schedule</h3>
                </div>

                <div className={styles.spaList}>
                  <div className={styles.spaItem}>
                    <span className={styles.spaTime}>03:00 PM</span>
                    <span className={styles.spaPet}>Kuchi (Lhasa Apso)</span>
                    <span className={styles.spaType}>Medicated Anti-Tick Bath + Scissoring</span>
                  </div>
                  <div className={styles.spaItem}>
                    <span className={styles.spaTime}>04:30 PM</span>
                    <span className={styles.spaPet}>Simba (Husky)</span>
                    <span className={styles.spaType}>Deep Deshedding + Hydrotherapy</span>
                  </div>
                </div>
              </div>

              <div className={styles.sideCard}>
                <div className={styles.sideCardHead}>
                  <Sun size={18} className={styles.sunIcon} />
                  <h3 className={styles.sideTitle}>Agility Yard &amp; Splash Pool</h3>
                </div>
                <p className={styles.sideText}>
                  Supervised outdoor group play in sanitized grass grounds. Next session at 04:00 PM.
                </p>
                <span className={styles.poolStatus}>● Splash Pool Clean &amp; Filtered</span>
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
