"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "../../components/layout/header";
import { Footer } from "../../components/layout/footer";
import { MobileActionBar } from "../../components/layout/mobile-action-bar";
import { Container } from "../../components/layout/container";
import {
  useAuth,
  DEMO_USERS,
  UserRoleCode,
  getRoleLabel,
} from "../../contexts/auth-context";
import {
  User,
  Lock,
  Mail,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  Heart,
  Building2,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import styles from "./login.module.css";

const ROLE_OPTIONS = [
  { code: "pet_owner", label: "Pet Parent / Owner", icon: Heart },
  { code: "veterinarian", label: "Veterinary Doctor", icon: Stethoscope },
  { code: "receptionist", label: "Front Desk & Triage", icon: Building2 },
  { code: "staff", label: "Resort & Boarding Staff", icon: Sparkles },
  { code: "admin", label: "Hospital Administrator", icon: ShieldCheck },
] as const;

export default function LoginPage() {
  const { login, signup, switchRole } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [regData, setRegData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    role: "pet_owner" as UserRoleCode,
    petName: "",
    petSpecies: "Dog (Canine)",
  });

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(loginEmail, loginPassword);
    } catch {
      setError("Unable to authenticate. Please check your credentials.");
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const fullName = `${regData.firstName} ${regData.lastName}`.trim();
      await signup(
        {
          name: fullName || "New User",
          email: regData.email,
          phone: regData.phone,
          role: regData.role,
          petName: regData.petName || undefined,
          petSpecies: regData.petSpecies || undefined,
          campus:
            regData.role === "staff"
              ? "Sector 87 Pet World"
              : "Sector 90 Hospital",
        },
        regData.password
      );
    } catch {
      setError("Registration failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className={styles.main}>
        <Container>
          <div className={styles.authWrapper}>
            {/* Header info */}
            <div className={styles.authHeader}>
              <span className={styles.eyebrow}>AVC Clinical Portals</span>
              <h1 className={styles.title}>
                {activeTab === "login"
                  ? "Sign In to Your Dedicated Portal"
                  : "Create Your AVC Account"}
              </h1>
              <p className={styles.subtitle}>
                Access real-time patient queues, electronic medical records, appointment scheduling, and pet resort stays.
              </p>
            </div>

            {/* Auth Card */}
            <div className={styles.card}>
              {/* Tab Switcher */}
              <div className={styles.tabs} role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "login"}
                  className={`${styles.tabBtn} ${
                    activeTab === "login" ? styles.tabBtnActive : ""
                  }`}
                  onClick={() => {
                    setActiveTab("login");
                    setError(null);
                  }}
                >
                  <span>Sign In</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "register"}
                  className={`${styles.tabBtn} ${
                    activeTab === "register" ? styles.tabBtnActive : ""
                  }`}
                  onClick={() => {
                    setActiveTab("register");
                    setError(null);
                  }}
                >
                  <span>Create Account</span>
                </button>
              </div>

              {error && (
                <div className={styles.errorAlert} role="alert">
                  <span>{error}</span>
                </div>
              )}

              {/* 1. SIGN IN TAB */}
              {activeTab === "login" && (
                <form onSubmit={handleLoginSubmit} className={styles.form}>
                  <div className={styles.field}>
                    <label htmlFor="loginEmail" className={styles.label}>
                      Email Address
                    </label>
                    <div className={styles.inputWrap}>
                      <Mail size={16} className={styles.inputIcon} aria-hidden="true" />
                      <input
                        type="email"
                        id="loginEmail"
                        required
                        placeholder="e.g. aarav.sharma@example.com"
                        className={styles.input}
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className={styles.field}>
                    <div className={styles.labelRow}>
                      <label htmlFor="loginPassword" className={styles.label}>
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          alert(
                            "For demo purposes, you can click any of the 1-click role buttons below to sign in instantly!"
                          )
                        }
                        className={styles.forgotBtn}
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className={styles.inputWrap}>
                      <Lock size={16} className={styles.inputIcon} aria-hidden="true" />
                      <input
                        type={showPassword ? "text" : "password"}
                        id="loginPassword"
                        required
                        placeholder="Enter your password"
                        className={styles.input}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={styles.eyeBtn}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={styles.submitBtn}
                  >
                    <span>{loading ? "Authenticating..." : "Sign In to Portal"}</span>
                    <ArrowRight size={15} aria-hidden="true" />
                  </button>

                  {/* 1-Click Role Switcher Demo Box */}
                  <div className={styles.demoBox}>
                    <div className={styles.demoHeader}>
                      <span className={styles.demoTitle}>Quick 1-Click Role Tester:</span>
                      <span className={styles.demoHint}>
                        Select a user to instantly launch their panel
                      </span>
                    </div>

                    <div className={styles.demoGrid}>
                      {(Object.keys(DEMO_USERS) as UserRoleCode[]).map((roleKey) => {
                        const demo = DEMO_USERS[roleKey];
                        return (
                          <button
                            key={roleKey}
                            type="button"
                            className={styles.demoRoleBtn}
                            onClick={() => switchRole(roleKey)}
                          >
                            <span className={styles.demoRoleTag}>
                              {getRoleLabel(roleKey)}
                            </span>
                            <span className={styles.demoUserName}>{demo.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </form>
              )}

              {/* 2. CREATE ACCOUNT TAB */}
              {activeTab === "register" && (
                <form onSubmit={handleRegisterSubmit} className={styles.form}>
                  {/* Role Selector */}
                  <div className={styles.field}>
                    <label className={styles.label}>Select Your Account Type</label>
                    <div className={styles.roleGrid}>
                      {ROLE_OPTIONS.map((opt) => {
                        const IconComponent = opt.icon;
                        const isSelected = regData.role === opt.code;
                        return (
                          <button
                            key={opt.code}
                            type="button"
                            className={`${styles.roleCard} ${
                              isSelected ? styles.roleCardActive : ""
                            }`}
                            onClick={() =>
                              setRegData({ ...regData, role: opt.code as UserRoleCode })
                            }
                          >
                            <IconComponent size={16} className={styles.roleIcon} />
                            <span className={styles.roleLabel}>{opt.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Name Fields */}
                  <div className={styles.row}>
                    <div className={styles.field}>
                      <label htmlFor="firstName" className={styles.label}>
                        First Name <span className={styles.req}>*</span>
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        required
                        placeholder="e.g. Aarav"
                        className={styles.inputNoIcon}
                        value={regData.firstName}
                        onChange={(e) =>
                          setRegData({ ...regData, firstName: e.target.value })
                        }
                      />
                    </div>
                    <div className={styles.field}>
                      <label htmlFor="lastName" className={styles.label}>
                        Last Name <span className={styles.req}>*</span>
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        required
                        placeholder="e.g. Sharma"
                        className={styles.inputNoIcon}
                        value={regData.lastName}
                        onChange={(e) =>
                          setRegData({ ...regData, lastName: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* Email & Phone */}
                  <div className={styles.row}>
                    <div className={styles.field}>
                      <label htmlFor="regEmail" className={styles.label}>
                        Email Address <span className={styles.req}>*</span>
                      </label>
                      <div className={styles.inputWrap}>
                        <Mail size={16} className={styles.inputIcon} aria-hidden="true" />
                        <input
                          type="email"
                          id="regEmail"
                          required
                          placeholder="e.g. aarav@example.com"
                          className={styles.input}
                          value={regData.email}
                          onChange={(e) =>
                            setRegData({ ...regData, email: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className={styles.field}>
                      <label htmlFor="regPhone" className={styles.label}>
                        Mobile Phone <span className={styles.req}>*</span>
                      </label>
                      <div className={styles.inputWrap}>
                        <Phone size={16} className={styles.inputIcon} aria-hidden="true" />
                        <input
                          type="tel"
                          id="regPhone"
                          required
                          placeholder="+91 98765 43210"
                          className={styles.input}
                          value={regData.phone}
                          onChange={(e) =>
                            setRegData({ ...regData, phone: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password */}
                  <div className={styles.field}>
                    <label htmlFor="regPassword" className={styles.label}>
                      Password <span className={styles.req}>*</span>
                    </label>
                    <div className={styles.inputWrap}>
                      <Lock size={16} className={styles.inputIcon} aria-hidden="true" />
                      <input
                        type={showPassword ? "text" : "password"}
                        id="regPassword"
                        required
                        minLength={6}
                        placeholder="Create a strong password"
                        className={styles.input}
                        value={regData.password}
                        onChange={(e) =>
                          setRegData({ ...regData, password: e.target.value })
                        }
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={styles.eyeBtn}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Pet Details if Pet Owner */}
                  {regData.role === "pet_owner" && (
                    <div className={styles.petBox}>
                      <span className={styles.petBoxTitle}>Pet Information:</span>
                      <div className={styles.row}>
                        <div className={styles.field}>
                          <label htmlFor="regPetName" className={styles.label}>
                            Pet&apos;s Name
                          </label>
                          <input
                            type="text"
                            id="regPetName"
                            placeholder="e.g. Bruno"
                            className={styles.inputNoIcon}
                            value={regData.petName}
                            onChange={(e) =>
                              setRegData({ ...regData, petName: e.target.value })
                            }
                          />
                        </div>
                        <div className={styles.field}>
                          <label htmlFor="regPetSpecies" className={styles.label}>
                            Species
                          </label>
                          <select
                            id="regPetSpecies"
                            className={styles.select}
                            value={regData.petSpecies}
                            onChange={(e) =>
                              setRegData({ ...regData, petSpecies: e.target.value })
                            }
                          >
                            <option value="Dog (Canine)">Dog (Canine)</option>
                            <option value="Cat (Feline)">Cat (Feline)</option>
                            <option value="Bird (Avian)">Bird (Avian)</option>
                            <option value="Rabbit / Hamster">Rabbit / Hamster</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className={styles.submitBtn}
                  >
                    <span>
                      {loading
                        ? "Setting up your account..."
                        : "Create Account & Open Portal"}
                    </span>
                    <ArrowRight size={15} aria-hidden="true" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </Container>
      </main>
      <Footer />
      <MobileActionBar />
    </>
  );
}
