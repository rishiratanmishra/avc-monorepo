"use client";

import { ApiError } from "@repo/api-client";
import Image from "next/image";
import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  User,
} from "lucide-react";
import { Container } from "../../layout/container";
import { Footer } from "../../layout/footer";
import { Header } from "../../layout/header";
import { MobileActionBar } from "../../layout/mobile-action-bar";
import { useAuth } from "../../../contexts/auth-context";
import styles from "../../../app/login/login.module.css";

type Mode = "signin" | "register";
type FieldErrors = Record<string, string>;

const reasonMessages: Record<string, string> = {
  expired: "Your session expired. Sign in again to continue.",
  revoked: "Your previous workspace is no longer available. Sign in to choose another.",
  forbidden: "That area is not available for this account.",
  unavailable: "The service is temporarily unavailable. Try again shortly.",
};

function messageFor(error: unknown): string {
  if (!(error instanceof ApiError)) {
    return "Something went wrong. Please try again.";
  }

  if (error.status === 0) {
    return "The service is unavailable. Check your connection and try again.";
  }
  if (error.code === "INVALID_CREDENTIALS") {
    return "The email or password is incorrect.";
  }
  if (error.code === "ACCOUNT_SUSPENDED") {
    return "This account is suspended. Contact your administrator.";
  }
  if (error.code === "EMAIL_NOT_VERIFIED") {
    return "Verify your email address before signing in.";
  }
  return error.message || "The request could not be completed.";
}

export function LoginScreen({ reason }: { reason?: string }) {
  const { status, context, login, register, requestPasswordReset } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [formError, setFormError] = useState<string | null>(
    reason ? reasonMessages[reason] ?? null : null,
  );
  const [notice, setNotice] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  useEffect(() => {
    if (status !== "authenticated") {
      return;
    }
    window.location.assign(context?.activeDestination?.path ?? "/workspace");
  }, [status, context]);

  function switchMode(nextMode: Mode) {
    setMode(nextMode);
    setFormError(null);
    setNotice(null);
    setFieldErrors({});
  }

  function validateSignIn(): boolean {
    const errors: FieldErrors = {};
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      errors.email = "Enter a valid email address.";
    }
    if (!password) {
      errors.password = "Enter your password.";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function validateRegistration(): boolean {
    const errors: FieldErrors = {};
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      errors.email = "Enter a valid email address.";
    }
    if (password.length < 15) {
      errors.password = "Use at least 15 characters.";
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
    if (!firstName.trim()) {
      errors.firstName = "Enter your first name.";
    }
    if (!lastName.trim()) {
      errors.lastName = "Enter your last name.";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setNotice(null);

    if (mode === "signin" ? !validateSignIn() : !validateRegistration()) {
      return;
    }

    setPending(true);
    try {
      if (mode === "signin") {
        await login(email.trim(), password);
      } else {
        const message = await register({
          email: email.trim(),
          password,
          profile: {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            locale: "en-IN",
            timeZone: "Asia/Kolkata",
          },
        });
        setNotice(message);
        setPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      setFormError(messageFor(error));
    } finally {
      setPending(false);
    }
  }

  async function handlePasswordReset() {
    setFormError(null);
    setNotice(null);
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setFieldErrors((current) => ({
        ...current,
        email: "Enter your email address first, then request a reset.",
      }));
      return;
    }

    setPending(true);
    try {
      setNotice(await requestPasswordReset(email.trim()));
    } catch (error) {
      setFormError(messageFor(error));
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <Header />
      <main className={styles.main}>
        <Container>
          <div className={styles.authWrapper}>
            <div className={styles.authHeader}>
              <span className={styles.eyebrow}>Secure account access</span>
              <h1 className={styles.title}>
                {mode === "signin" ? "Sign in to AVC" : "Create your AVC account"}
              </h1>
              <p className={styles.subtitle}>
                One account for pet parents, hospital teams, and platform administration.
              </p>
            </div>

            <div className={styles.card}>
              <div className={styles.tabs} role="tablist" aria-label="Account access">
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === "signin"}
                  className={`${styles.tabBtn} ${mode === "signin" ? styles.tabBtnActive : ""}`}
                  onClick={() => switchMode("signin")}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === "register"}
                  className={`${styles.tabBtn} ${mode === "register" ? styles.tabBtnActive : ""}`}
                  onClick={() => switchMode("register")}
                >
                  Create Account
                </button>
              </div>

              {formError ? (
                <div className={styles.errorAlert} role="alert">
                  {formError}
                </div>
              ) : null}
              {notice ? (
                <div className={styles.noticeAlert} role="status">
                  {notice}
                </div>
              ) : null}

              <form className={styles.form} onSubmit={handleSubmit} noValidate>
                {mode === "register" ? (
                  <div className={styles.row}>
                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="firstName">
                        First name <span className={styles.req}>*</span>
                      </label>
                      <input
                        id="firstName"
                        className={styles.inputNoIcon}
                        value={firstName}
                        onChange={(event) => setFirstName(event.target.value)}
                        autoComplete="given-name"
                        aria-invalid={Boolean(fieldErrors.firstName)}
                        aria-describedby={fieldErrors.firstName ? "firstName-error" : undefined}
                      />
                      {fieldErrors.firstName ? (
                        <span id="firstName-error" className={styles.fieldError}>
                          {fieldErrors.firstName}
                        </span>
                      ) : null}
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="lastName">
                        Last name <span className={styles.req}>*</span>
                      </label>
                      <input
                        id="lastName"
                        className={styles.inputNoIcon}
                        value={lastName}
                        onChange={(event) => setLastName(event.target.value)}
                        autoComplete="family-name"
                        aria-invalid={Boolean(fieldErrors.lastName)}
                        aria-describedby={fieldErrors.lastName ? "lastName-error" : undefined}
                      />
                      {fieldErrors.lastName ? (
                        <span id="lastName-error" className={styles.fieldError}>
                          {fieldErrors.lastName}
                        </span>
                      ) : null}
                    </div>
                  </div>
                ) : null}

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="email">
                    Email address <span className={styles.req}>*</span>
                  </label>
                  <div className={styles.inputWrap}>
                    <Mail className={styles.inputIcon} size={16} aria-hidden="true" />
                    <input
                      id="email"
                      type="email"
                      className={styles.input}
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      autoComplete="email"
                      aria-invalid={Boolean(fieldErrors.email)}
                      aria-describedby={fieldErrors.email ? "email-error" : undefined}
                    />
                  </div>
                  {fieldErrors.email ? (
                    <span id="email-error" className={styles.fieldError}>
                      {fieldErrors.email}
                    </span>
                  ) : null}
                </div>

                <div className={styles.field}>
                  <div className={styles.labelRow}>
                    <label className={styles.label} htmlFor="password">
                      Password <span className={styles.req}>*</span>
                    </label>
                    {mode === "signin" ? (
                      <button
                        type="button"
                        className={styles.forgotBtn}
                        onClick={handlePasswordReset}
                        disabled={pending}
                      >
                        Forgot password?
                      </button>
                    ) : null}
                  </div>
                  <div className={styles.inputWrap}>
                    <Lock className={styles.inputIcon} size={16} aria-hidden="true" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className={styles.input}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      autoComplete={mode === "signin" ? "current-password" : "new-password"}
                      minLength={mode === "register" ? 15 : undefined}
                      aria-invalid={Boolean(fieldErrors.password)}
                      aria-describedby={fieldErrors.password ? "password-error" : undefined}
                    />
                    <button
                      type="button"
                      className={styles.eyeBtn}
                      onClick={() => setShowPassword((current) => !current)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                  {fieldErrors.password ? (
                    <span id="password-error" className={styles.fieldError}>
                      {fieldErrors.password}
                    </span>
                  ) : null}
                </div>

                {mode === "register" ? (
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="confirmPassword">
                      Confirm password <span className={styles.req}>*</span>
                    </label>
                    <div className={styles.inputWrap}>
                      <ShieldCheck className={styles.inputIcon} size={16} aria-hidden="true" />
                      <input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        className={styles.input}
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        autoComplete="new-password"
                        aria-invalid={Boolean(fieldErrors.confirmPassword)}
                        aria-describedby={
                          fieldErrors.confirmPassword ? "confirmPassword-error" : undefined
                        }
                      />
                    </div>
                    {fieldErrors.confirmPassword ? (
                      <span id="confirmPassword-error" className={styles.fieldError}>
                        {fieldErrors.confirmPassword}
                      </span>
                    ) : null}
                  </div>
                ) : null}

                <button type="submit" className={styles.submitBtn} disabled={pending}>
                  {pending ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Account"}
                  {!pending ? <ArrowRight size={17} aria-hidden="true" /> : null}
                </button>
              </form>

              <div className={styles.trustNote}>
                <Image
                  src="/images/logo-avc-hospital.png"
                  alt=""
                  width={28}
                  height={28}
                  aria-hidden="true"
                />
                <span>
                  <User size={12} aria-hidden="true" /> access is issued by the hospital. Workspace
                  options are chosen from your account after sign-in.
                </span>
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
      <MobileActionBar />
    </>
  );
}
