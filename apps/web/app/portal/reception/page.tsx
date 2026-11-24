"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "../../../components/layout/header";
import { Footer } from "../../../components/layout/footer";
import { Container } from "../../../components/layout/container";
import { useAuth } from "../../../contexts/auth-context";
import {
  Building2,
  Users,
  AlertOctagon,
  Clock,
  CheckCircle,
  PlusCircle,
  UserCheck,
  Search,
  PhoneCall,
  Bed,
} from "lucide-react";
import styles from "./reception.module.css";

const DOCTOR_ROOMS = [
  { room: "OPD 01", doctor: "Dr. Hardeep Beniwal", specialty: "Surgeon / Orthopedics", status: "Occupied (T-01)" },
  { room: "OPD 02", doctor: "Dr. Ananya Rao", specialty: "Internal Medicine / OPD", status: "Available" },
  { room: "Feline OPD 03", doctor: "Dr. Priyamvada", specialty: "Cat Care Specialist", status: "Ready for Cleo (T-02)" },
];

export default function ReceptionPortal() {
  const { user } = useAuth();
  const [tokensIssued, setTokensIssued] = useState(14);

  return (
    <>
      <Header />
      <main className={styles.main}>
        <Container>
          <div className={styles.topBar}>
            <div>
              <span className={styles.roleBadge}>Front Desk &amp; Triage Console</span>
              <h1 className={styles.title}>
                {user?.name || "Neha Verma"} — Sector 90 Reception
              </h1>
              <p className={styles.sub}>
                Real-time token management, species-separated waiting areas, and emergency triage.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setTokensIssued((prev) => prev + 1);
                alert(`New Token T-${tokensIssued + 1} Generated for Walk-In!`);
              }}
              className={styles.newWalkinBtn}
            >
              <PlusCircle size={15} />
              <span>Issue Walk-in Token</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <span className={styles.mLabel}>Tokens Issued Today</span>
              <span className={styles.mValue}>{tokensIssued}</span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.mLabel}>Currently In Waiting Rooms</span>
              <span className={styles.mValue}>5 Patients</span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.mLabel}>Cat Care Quiet Suite</span>
              <span className={styles.mValueSuccess}>1 Feline Seated</span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.mLabel}>Trauma ICU Readiness</span>
              <span className={styles.mValueAlert}>ICU On-Call Ready</span>
            </div>
          </div>

          <div className={styles.grid}>
            {/* Left: Active Waiting Queue */}
            <div className={styles.mainCol}>
              <div className={styles.panelCard}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>Live Waiting Room Queue</h2>
                  <span className={styles.areaTag}>Sector 90 Hospital Lobby</span>
                </div>

                <div className={styles.queueList}>
                  <div className={styles.queueItem}>
                    <div className={styles.tokenTag}>T-01</div>
                    <div className={styles.patientMeta}>
                      <span className={styles.petName}>Bruno (Golden Retriever)</span>
                      <span className={styles.ownerInfo}>Parent: Aarav Sharma · Limp Exam</span>
                    </div>
                    <span className={styles.inRoomPill}>With Dr. Hardeep (Room 01)</span>
                  </div>

                  <div className={styles.queueItem}>
                    <div className={styles.tokenTag}>T-02</div>
                    <div className={styles.patientMeta}>
                      <span className={styles.petName}>Cleo (Persian Cat)</span>
                      <span className={styles.ownerInfo}>Parent: Sanya Malik · Feline Wing</span>
                    </div>
                    <span className={styles.calledPill}>Called to Room 03</span>
                  </div>

                  <div className={styles.queueItem}>
                    <div className={styles.tokenTag}>T-03</div>
                    <div className={styles.patientMeta}>
                      <span className={styles.petName}>Rocky (German Shepherd)</span>
                      <span className={styles.ownerInfo}>Parent: Vikram Malhotra · Ear Care</span>
                    </div>
                    <span className={styles.waitingPill}>Waiting (8 min)</span>
                  </div>
                </div>
              </div>

              {/* Consultation Rooms Status */}
              <div className={styles.panelCard}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>Doctor Consultation Rooms</h2>
                </div>

                <div className={styles.roomsGrid}>
                  {DOCTOR_ROOMS.map((rm) => (
                    <div key={rm.room} className={styles.roomCard}>
                      <div className={styles.roomHeader}>
                        <span className={styles.roomNo}>{rm.room}</span>
                        <span
                          className={
                            rm.status.startsWith("Available")
                              ? styles.statusAvail
                              : styles.statusBusy
                          }
                        >
                          {rm.status}
                        </span>
                      </div>
                      <h3 className={styles.doctorName}>{rm.doctor}</h3>
                      <span className={styles.doctorSpecialty}>{rm.specialty}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Emergency Dispatch & Ambulance */}
            <div className={styles.sideCol}>
              <div className={styles.emergencyCard}>
                <div className={styles.emergencyHead}>
                  <AlertOctagon size={20} className={styles.emIcon} />
                  <h3 className={styles.emTitle}>Emergency Trauma Protocol</h3>
                </div>
                <p className={styles.emText}>
                  For acute polytrauma, breathing distress or poisoning, trigger the crash cart immediately.
                </p>
                <button
                  type="button"
                  onClick={() => alert("Crash cart alerted for trauma bay")}
                  className={styles.emAlertBtn}
                >
                  Alert ICU Bay
                </button>
              </div>

              <div className={styles.sideCard}>
                <h3 className={styles.sideCardTitle}>Pet Ambulance / Transport</h3>
                <p className={styles.sideCardText}>
                  Gurugram mobile pet pick-up &amp; emergency transfer hotline.
                </p>
                <a href="tel:+919990070026" className={styles.callHotline}>
                  <PhoneCall size={14} />
                  <span>Ambulance: 99900 70026</span>
                </a>
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
