"use client";

import React from "react";
import Link from "next/link";
import { Header } from "../../../components/layout/header";
import { Footer } from "../../../components/layout/footer";
import { Container } from "../../../components/layout/container";
import { useAuth, DEMO_USERS, UserRoleCode, getRoleLabel } from "../../../contexts/auth-context";
import {
  ShieldCheck,
  Building,
  Users,
  Activity,
  ArrowUpRight,
  TrendingUp,
  Clock,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import styles from "./admin.module.css";

const AUDIT_LOGS = [
  { action: "role.assigned.veterinarian", actor: "Admin", target: "Dr. Priyamvada", time: "18 mins ago" },
  { action: "appointment.completed", actor: "Dr. Hardeep", target: "Bruno (Aarav Sharma)", time: "42 mins ago" },
  { action: "lab.report.uploaded", actor: "IDEXX System", target: "Complete Blood Profile", time: "1 hr ago" },
  { action: "token.dispatched", actor: "Neha Verma", target: "T-14 (Sector 90 Lobby)", time: "2 hrs ago" },
];

export default function AdminPortal() {
  const { user } = useAuth();

  return (
    <>
      <Header />
      <main className={styles.main}>
        <Container>
          <div className={styles.topBar}>
            <div>
              <span className={styles.roleBadge}>Executive Hospital Administrator</span>
              <h1 className={styles.title}>
                AVC Hospital &amp; Pet Resort Central Command
              </h1>
              <p className={styles.sub}>
                Overview of Sector 90 Hospital &amp; Sector 87 Pet World operations, clinical teams, and audit trails.
              </p>
            </div>

            <div className={styles.topActions}>
              <a
                href="http://localhost:3002"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.externalAdminBtn}
              >
                <span>Full Ant Design Admin (Port 3002)</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>

          {/* KPI Metrics */}
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <span className={styles.mLabel}>Today&apos;s Total Patients</span>
              <span className={styles.mValue}>42 Treated</span>
              <span className={styles.mTrend}>
                <TrendingUp size={12} /> +14% vs yesterday
              </span>
            </div>

            <div className={styles.metricCard}>
              <span className={styles.mLabel}>ICU Bed Utilization</span>
              <span className={styles.mValue}>2 / 6 Beds</span>
              <span className={styles.mSubText}>Trauma ready</span>
            </div>

            <div className={styles.metricCard}>
              <span className={styles.mLabel}>IDEXX Lab Turnaround</span>
              <span className={styles.mValueSuccess}>14.2 Mins Avg</span>
              <span className={styles.mSubText}>Under 15-min target</span>
            </div>

            <div className={styles.metricCard}>
              <span className={styles.mLabel}>Pet World Resort Occupancy</span>
              <span className={styles.mValue}>75% (9 / 12)</span>
              <span className={styles.mSubText}>Sector 87 Campus</span>
            </div>
          </div>

          <div className={styles.grid}>
            {/* Left: Staff & Doctor Directory */}
            <div className={styles.mainCol}>
              <div className={styles.panelCard}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>Hospital User Roles &amp; Team Directory</h2>
                  <span className={styles.badgeCount}>5 Configured Roles</span>
                </div>

                <div className={styles.userList}>
                  {(Object.keys(DEMO_USERS) as UserRoleCode[]).map((rKey) => {
                    const u = DEMO_USERS[rKey];
                    return (
                      <div key={rKey} className={styles.userRow}>
                        <div className={styles.userAvatar}>
                          {u.name.charAt(0)}
                        </div>
                        <div className={styles.userMeta}>
                          <span className={styles.userName}>{u.name}</span>
                          <span className={styles.userEmail}>{u.email}</span>
                          <span className={styles.userCampus}>{u.campus}</span>
                        </div>
                        <span className={styles.roleTagPill}>{getRoleLabel(rKey)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Multi-Campus Real-Time Status */}
              <div className={styles.panelCard}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>Campus Operating Status</h2>
                </div>

                <div className={styles.campusGrid}>
                  <div className={styles.campusBox}>
                    <div className={styles.campusHead}>
                      <span className={styles.campusTitle}>Sector 90 Hospital &amp; 24/7 ICU</span>
                      <span className={styles.statusLive}>● 24/7 Active</span>
                    </div>
                    <p className={styles.campusDesc}>
                      Emergency surgeons on-site, modular OTs prepped, IDEXX diagnostic lab operational, Feline OPD open.
                    </p>
                  </div>

                  <div className={styles.campusBox}>
                    <div className={styles.campusHead}>
                      <span className={styles.campusTitle}>Sector 87 Pet World Resort</span>
                      <span className={styles.statusLive}>● Open (9 AM - 8 PM)</span>
                    </div>
                    <p className={styles.campusDesc}>
                      AC suites 75% full, splash pool filtered, supervised play groups active in agility park.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Security & Audit Trail */}
            <div className={styles.sideCol}>
              <div className={styles.sideCard}>
                <div className={styles.sideCardHead}>
                  <ShieldAlert size={18} className={styles.auditIcon} />
                  <h3 className={styles.sideTitle}>Security &amp; Audit Logs</h3>
                </div>

                <div className={styles.auditList}>
                  {AUDIT_LOGS.map((log, idx) => (
                    <div key={idx} className={styles.auditItem}>
                      <span className={styles.logAction}>{log.action}</span>
                      <span className={styles.logTarget}>
                        {log.actor} → {log.target}
                      </span>
                      <span className={styles.logTime}>
                        <Clock size={10} />
                        {log.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
