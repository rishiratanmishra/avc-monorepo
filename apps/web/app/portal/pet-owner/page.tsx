"use client";

import React from "react";
import Link from "next/link";
import { Header } from "../../../components/layout/header";
import { Footer } from "../../../components/layout/footer";
import { Container } from "../../../components/layout/container";
import { useAuth } from "../../../contexts/auth-context";
import {
  Heart,
  Calendar,
  FileText,
  Clock,
  ShieldCheck,
  PlusCircle,
  PhoneCall,
  Activity,
  Award,
  ChevronRight,
  MapPin,
  AlertCircle,
} from "lucide-react";
import styles from "./portal.module.css";

export default function PetOwnerPortal() {
  const { user, logout } = useAuth();

  return (
    <>
      <Header />
      <main className={styles.main}>
        <Container>
          {/* Portal Top Bar */}
          <div className={styles.topBar}>
            <div>
              <span className={styles.panelBadge}>Pet Parent Health Portal</span>
              <h1 className={styles.welcomeTitle}>
                Welcome back, {user?.name || "Aarav"}! 🐾
              </h1>
              <p className={styles.welcomeSub}>
                Manage your pets, upcoming clinical consultations, electronic vaccine cards, and resort stays.
              </p>
            </div>

            <div className={styles.topActions}>
              <Link href="/services#services-catalog" className={styles.primaryBtn}>
                <PlusCircle size={15} aria-hidden="true" />
                <span>Book New Visit</span>
              </Link>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <div className={styles.metricIconWrap}>
                <Heart size={20} className={styles.heartIcon} />
              </div>
              <div>
                <span className={styles.metricLabel}>Registered Pets</span>
                <span className={styles.metricValue}>1 Active (Bruno)</span>
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricIconWrap}>
                <Calendar size={20} className={styles.calendarIcon} />
              </div>
              <div>
                <span className={styles.metricLabel}>Next Appointment</span>
                <span className={styles.metricValue}>Tomorrow, 10:30 AM</span>
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricIconWrap}>
                <ShieldCheck size={20} className={styles.shieldIcon} />
              </div>
              <div>
                <span className={styles.metricLabel}>Vaccine Status</span>
                <span className={styles.metricValueSuccess}>100% Up to Date</span>
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricIconWrap}>
                <FileText size={20} className={styles.fileIcon} />
              </div>
              <div>
                <span className={styles.metricLabel}>Clinical Reports</span>
                <span className={styles.metricValue}>3 Verified Records</span>
              </div>
            </div>
          </div>

          <div className={styles.contentGrid}>
            {/* Left Column: Pet Profile & Appointments */}
            <div className={styles.mainCol}>
              {/* Pet Card */}
              <div className={styles.panelSection}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>My Pets</h2>
                  <button
                    type="button"
                    onClick={() => alert("Pet profile registration opened")}
                    className={styles.textBtn}
                  >
                    + Add Another Pet
                  </button>
                </div>

                <div className={styles.petCard}>
                  <div className={styles.petAvatar}>🐕</div>
                  <div className={styles.petInfo}>
                    <div className={styles.petNameRow}>
                      <h3 className={styles.petName}>Bruno</h3>
                      <span className={styles.petBreed}>Golden Retriever · Male (3 Yrs)</span>
                    </div>
                    <span className={styles.microchip}>
                      Microchip ID: 981-098-102-341-234 · Sector 90 Primary File
                    </span>

                    <div className={styles.petStats}>
                      <span className={styles.petStatPill}>Weight: 31.4 kg</span>
                      <span className={styles.petStatPill}>Blood Type: DEA 1.1 +</span>
                      <span className={styles.petStatPillActive}>Vaccines Current</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upcoming Appointments */}
              <div className={styles.panelSection}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Upcoming Consultations</h2>
                </div>

                <div className={styles.appointmentCard}>
                  <div className={styles.apptTimeBox}>
                    <span className={styles.apptDay}>FRI</span>
                    <span className={styles.apptDate}>20</span>
                    <span className={styles.apptTime}>10:30 AM</span>
                  </div>

                  <div className={styles.apptDetails}>
                    <span className={styles.apptCategory}>Comprehensive OPD Checkup</span>
                    <h3 className={styles.apptDoctor}>Dr. Hardeep Beniwal (Chief Surgeon)</h3>
                    <span className={styles.apptLocation}>
                      <MapPin size={12} aria-hidden="true" />
                      Sector 90 Hospital · Room 02
                    </span>
                    <span className={styles.apptReason}>
                      Reason: Annual wellness review &amp; dietary assessment
                    </span>
                  </div>

                  <div className={styles.apptAction}>
                    <span className={styles.confirmedPill}>Confirmed</span>
                  </div>
                </div>
              </div>

              {/* Electronic Medical Records */}
              <div className={styles.panelSection}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Recent Medical Reports &amp; Labs</h2>
                </div>

                <div className={styles.reportsList}>
                  <div className={styles.reportRow}>
                    <FileText size={18} className={styles.reportIcon} />
                    <div className={styles.reportMeta}>
                      <span className={styles.reportTitle}>IDEXX 15-Min Complete Blood Profile</span>
                      <span className={styles.reportSub}>Sector 90 Diagnostic Lab · Dr. Hardeep Beniwal</span>
                    </div>
                    <span className={styles.statusNormal}>Normal</span>
                  </div>

                  <div className={styles.reportRow}>
                    <FileText size={18} className={styles.reportIcon} />
                    <div className={styles.reportMeta}>
                      <span className={styles.reportTitle}>Core Vaccination Certificate (DHPPi + Rabies)</span>
                      <span className={styles.reportSub}>Valid until February 2027 · Batch #V-8941</span>
                    </div>
                    <span className={styles.statusActive}>Certified</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Quick Care Helpline & Resort */}
            <div className={styles.sideCol}>
              {/* Emergency Hotline Card */}
              <div className={styles.sideCardEmergency}>
                <div className={styles.emergencyIconWrap}>
                  <AlertCircle size={22} />
                </div>
                <h3 className={styles.sideCardTitle}>24/7 Trauma Emergency?</h3>
                <p className={styles.sideCardText}>
                  Zero wait time for critical care. Call our emergency trauma desk directly.
                </p>
                <a href="tel:+919990070026" className={styles.emergencyBtn}>
                  <PhoneCall size={14} />
                  <span>Call 24/7 ICU: 99900 70026</span>
                </a>
              </div>

              {/* Luxury Boarding Booking Card */}
              <div className={styles.sideCard}>
                <h3 className={styles.sideCardTitle}>AVC Pet World Resort</h3>
                <p className={styles.sideCardText}>
                  Planning a vacation? Book an air-conditioned luxury suite with splash pool in Sector 87.
                </p>
                <Link href="/services#services-catalog" className={styles.sideCardBtn}>
                  <span>Check Suite Availability</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
