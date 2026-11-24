"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "../../../components/layout/header";
import { Footer } from "../../../components/layout/footer";
import { Container } from "../../../components/layout/container";
import { useAuth } from "../../../contexts/auth-context";
import {
  Stethoscope,
  Activity,
  Clock,
  User,
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
  Cpu,
  Plus,
} from "lucide-react";
import styles from "./doctor.module.css";

const OPD_QUEUE = [
  {
    token: "T-01",
    pet: "Bruno",
    species: "Golden Retriever (Dog)",
    owner: "Aarav Sharma",
    reason: "Post-op limb review & limping examination",
    status: "In Consultation",
    urgency: "Routine",
  },
  {
    token: "T-02",
    pet: "Cleo",
    species: "Persian Cat (Feline)",
    owner: "Sanya Malik",
    reason: "Cat Care OPD: Suspected FLUTD / straining",
    status: "Waiting (5 min)",
    urgency: "Priority",
  },
  {
    token: "T-03",
    pet: "Rocky",
    species: "German Shepherd (Dog)",
    owner: "Vikram Malhotra",
    reason: "Ear discharge & bilateral otitis checkup",
    status: "Waiting (15 min)",
    urgency: "Routine",
  },
  {
    token: "T-04",
    pet: "Coco",
    species: "Labrador Retriever",
    owner: "Deepak Mehta",
    reason: "Trauma: Minor hit-and-run paw laceration",
    status: "Checked In",
    urgency: "Urgent",
  },
];

const SURGERY_SCHEDULE = [
  {
    time: "02:00 PM",
    pet: "Max",
    species: "Beagle",
    procedure: "Laparoscopic Keyhole Spaying",
    theater: "Modular OT 01 (Sterile Positive-Pressure)",
    anesthesia: "Isoflurane Gas + Multimonitor",
  },
  {
    time: "04:30 PM",
    pet: "Simba",
    species: "Siberian Husky",
    procedure: "Tibial Plateau Leveling (TPLO Cruciate)",
    theater: "Modular OT 02 (Orthopedic Power Suite)",
    anesthesia: "Sevoflurane Gas + Epidural",
  },
];

export default function DoctorPortal() {
  const { user } = useAuth();
  const [activeQueue, setActiveQueue] = useState(OPD_QUEUE);

  return (
    <>
      <Header />
      <main className={styles.main}>
        <Container>
          {/* Top Bar */}
          <div className={styles.topBar}>
            <div>
              <span className={styles.roleBadge}>Veterinarian Clinical Desk</span>
              <h1 className={styles.title}>
                {user?.name || "Dr. Hardeep Beniwal"} — OPD &amp; Surgical Roster
              </h1>
              <p className={styles.sub}>
                Sector 90 Hospital · Room 01 &amp; Modular Positive-Pressure Surgical Suite
              </p>
            </div>

            <div className={styles.statusPill}>
              <span className={styles.pulseDot} />
              <span>Duty Status: On Active OPD</span>
            </div>
          </div>

          {/* Quick Doctor Metrics */}
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <span className={styles.mLabel}>Active OPD Queue</span>
              <span className={styles.mValue}>4 Patients</span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.mLabel}>Surgeries Scheduled</span>
              <span className={styles.mValue}>2 Modular OT</span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.mLabel}>IDEXX Lab Reports</span>
              <span className={styles.mValueSuccess}>3 Ready for Review</span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.mLabel}>Trauma ICU Status</span>
              <span className={styles.mValueAlert}>1 ICU Case Active</span>
            </div>
          </div>

          <div className={styles.layoutGrid}>
            {/* Left Column: Live Patient Queue */}
            <div className={styles.mainCol}>
              <div className={styles.panelCard}>
                <div className={styles.cardHead}>
                  <div>
                    <h2 className={styles.cardTitle}>Live OPD Patient Queue</h2>
                    <span className={styles.cardSub}>
                      Sorted by arrival &amp; clinical triage priority
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => alert("Added emergency walk-in token")}
                    className={styles.actionBtn}
                  >
                    <Plus size={14} />
                    <span>Add Walk-In</span>
                  </button>
                </div>

                <div className={styles.queueTable}>
                  {activeQueue.map((item) => (
                    <div key={item.token} className={styles.queueRow}>
                      <div className={styles.tokenBox}>
                        <span className={styles.tokenText}>{item.token}</span>
                      </div>

                      <div className={styles.patientInfo}>
                        <div className={styles.petHeader}>
                          <span className={styles.petName}>{item.pet}</span>
                          <span className={styles.speciesText}>({item.species})</span>
                          {item.urgency === "Urgent" && (
                            <span className={styles.urgentBadge}>Urgent</span>
                          )}
                        </div>
                        <span className={styles.ownerText}>Parent: {item.owner}</span>
                        <p className={styles.reasonText}>{item.reason}</p>
                      </div>

                      <div className={styles.statusCol}>
                        <span
                          className={
                            item.status.startsWith("In Consultation")
                              ? styles.inConsultPill
                              : styles.waitPill
                          }
                        >
                          {item.status}
                        </span>
                        <button
                          type="button"
                          onClick={() => alert(`Opening medical chart for ${item.pet}`)}
                          className={styles.chartBtn}
                        >
                          Open E-Chart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Today's Surgical Theaters */}
              <div className={styles.panelCard}>
                <div className={styles.cardHead}>
                  <h2 className={styles.cardTitle}>Modular OT Surgical Schedule</h2>
                  <span className={styles.theaterBadge}>Positive-Pressure Cleanroom</span>
                </div>

                <div className={styles.surgeryList}>
                  {SURGERY_SCHEDULE.map((surg, idx) => (
                    <div key={idx} className={styles.surgeryRow}>
                      <div className={styles.surgeryTime}>
                        <Clock size={14} />
                        <span>{surg.time}</span>
                      </div>
                      <div className={styles.surgeryDetails}>
                        <h3 className={styles.surgeryProcedure}>{surg.procedure}</h3>
                        <span className={styles.surgeryPet}>
                          Patient: {surg.pet} ({surg.species})
                        </span>
                        <span className={styles.surgeryTheater}>{surg.theater}</span>
                        <span className={styles.surgeryAnesth}>
                          Anesthesia: {surg.anesthesia}
                        </span>
                      </div>
                      <span className={styles.preppedPill}>Prepped &amp; Cleared</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Lab Alerts & Clinical Tools */}
            <div className={styles.sideCol}>
              <div className={styles.sideCard}>
                <div className={styles.sideCardHead}>
                  <Cpu size={18} className={styles.labIcon} />
                  <h3 className={styles.sideTitle}>Rapid IDEXX Lab Feed</h3>
                </div>

                <div className={styles.labAlerts}>
                  <div className={styles.labItem}>
                    <span className={styles.labTime}>12 min ago</span>
                    <span className={styles.labPatient}>Bruno (Golden Retriever)</span>
                    <span className={styles.labTest}>Biochemistry &amp; Electrolytes (Normal)</span>
                  </div>

                  <div className={styles.labItem}>
                    <span className={styles.labTime}>28 min ago</span>
                    <span className={styles.labPatient}>Cleo (Persian Cat)</span>
                    <span className={styles.labTest}>Urinalysis &amp; Sedimentation (Ready)</span>
                  </div>
                </div>
              </div>

              {/* Quick E-Prescription Writer */}
              <div className={styles.sideCard}>
                <h3 className={styles.sideTitle}>Digital Prescription Desk</h3>
                <p className={styles.sideText}>
                  Send verified prescriptions directly to the 24/7 on-site pharmacy for immediate dispensing.
                </p>
                <button
                  type="button"
                  onClick={() => alert("Digital prescription composer opened")}
                  className={styles.rxBtn}
                >
                  <FileSpreadsheet size={15} />
                  <span>Draft Digital Rx</span>
                </button>
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
