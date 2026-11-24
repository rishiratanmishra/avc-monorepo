"use client";

import { ApiError } from "@repo/api-client";
import { ArrowLeft, ArrowRight, Lock, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
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
  const previousMode = useRef<Mode>(mode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [formError, setFormError] = useState<string | null>(
    reason ? (reasonMessages[reason] ?? null) : null,
  );
  const [notice, setNotice] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  useEffect(() => {
    if (status !== "authenticated") {
      return;
    }
    window.location.assign(context?.activeDestination?.path ?? "/workspace");
  }, [status, context]);

  useEffect(() => {
    if (previousMode.current === mode) {
      return;
    }
    previousMode.current = mode;
    const firstFieldId = mode === "signin" ? "email" : "firstName";
    document.getElementById(firstFieldId)?.focus();
  }, [mode]);

  function switchMode(nextMode: Mode) {
    setMode(nextMode);
    setShowPassword(false);
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
    <main className={styles.page} data-auth-page="">
      <div className={styles.layout}>
        <aside className={styles.brandPanel} aria-labelledby="brand-title">
          <Image
            src="/images/doctor-dr-hardeep-opd-consult.jpg"
            alt="AVC veterinarian examining a dog in a modern consultation room"
            fill
            sizes="(min-width: 992px) 50vw, 100vw"
            priority
            className={styles.brandImage}
          />
          <div className={styles.brandOverlay} aria-hidden="true" />

          <Link href="/" className={styles.brandLogoLink} aria-label="AVC Pet Hospital home">
            <Image
              src="/images/logo-avc-hospital.png"
              alt=""
              width={180}
              height={44}
              priority
              className={styles.brandLogo}
            />
          </Link>

          <div className={styles.brandMessage}>
            <h1 id="brand-title" className={styles.brandTitle}>
              Compassionate
              <br />
              Veterinary Care
            </h1>
            <p className={styles.brandSubtitle}>For your pets, at every stage of life.</p>
          </div>
        </aside>

        <section className={styles.formPanel} aria-labelledby="form-title">
          <div className={styles.formTop}>
            <Link href="/" className={styles.backLink}>
              <ArrowLeft size={14} aria-hidden="true" />
              <span>Back to site</span>
            </Link>
          </div>

          <div className={styles.formContent}>
            <div className={styles.formInner}>
              <h2 id="form-title" className={styles.formTitle}>
                {mode === "signin" ? "Welcome Back" : "Create your account"}
              </h2>
              <p className={styles.formSubtitle}>
                {mode === "signin"
                  ? "Sign in to your AVC account"
                  : "Manage your pet’s care, all in one place."}
              </p>

              {formError ? (
                <div id="auth-form-error" className={styles.errorAlert} role="alert">
                  {formError}
                </div>
              ) : null}
              {notice ? (
                <div id="auth-form-notice" className={styles.noticeAlert} role="status">
                  {notice}
                </div>
              ) : null}

              <form
                className={styles.form}
                onSubmit={handleSubmit}
                noValidate
                aria-busy={pending}
                aria-describedby={
                  formError ? "auth-form-error" : notice ? "auth-form-notice" : undefined
                }
              >
                {mode === "register" ? (
                  <div className={styles.row}>
                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="firstName">
                        First name <span className={styles.req}>*</span>
                      </label>
                      <input
                        id="firstName"
                        className={styles.input}
                        value={firstName}
                        onChange={(event) => setFirstName(event.target.value)}
                        autoComplete="given-name"
                        aria-invalid={Boolean(fieldErrors.firstName)}
                        aria-describedby={fieldErrors.firstName ? "firstName-error" : undefined}
                      />
                      {fieldErrors.firstName ? (
                        <span id="firstName-error" className={styles.fieldError} role="alert">
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
                        className={styles.input}
                        value={lastName}
                        onChange={(event) => setLastName(event.target.value)}
                        autoComplete="family-name"
                        aria-invalid={Boolean(fieldErrors.lastName)}
                        aria-describedby={fieldErrors.lastName ? "lastName-error" : undefined}
                      />
                      {fieldErrors.lastName ? (
                        <span id="lastName-error" className={styles.fieldError} role="alert">
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
                    <Mail size={16} className={styles.inputIcon} aria-hidden="true" />
                    <input
                      id="email"
                      type="email"
                      className={styles.input}
                      placeholder="Enter your email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      autoComplete="email"
                      aria-invalid={Boolean(fieldErrors.email)}
                      aria-describedby={fieldErrors.email ? "email-error" : undefined}
                    />
                  </div>
                  {fieldErrors.email ? (
                    <span id="email-error" className={styles.fieldError} role="alert">
                      {fieldErrors.email}
                    </span>
                  ) : null}
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="password">
                    Password <span className={styles.req}>*</span>
                  </label>
                  <div className={styles.inputWrap}>
                    <Lock size={16} className={styles.inputIcon} aria-hidden="true" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className={`${styles.input} ${styles.inputWithAction}`}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      autoComplete={mode === "signin" ? "current-password" : "new-password"}
                      minLength={mode === "register" ? 15 : undefined}
                      aria-invalid={Boolean(fieldErrors.password)}
                      aria-describedby={fieldErrors.password ? "password-error" : undefined}
                    />
                    <button
                      type="button"
                      className={`${styles.textButton} ${styles.visibilityButton}`}
                      onClick={() => setShowPassword((current) => !current)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      aria-pressed={showPassword}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  {fieldErrors.password ? (
                    <span id="password-error" className={styles.fieldError} role="alert">
                      {fieldErrors.password}
                    </span>
                  ) : null}
                  {mode === "signin" ? (
                    <div className={styles.forgotRow}>
                      <button
                        type="button"
                        className={styles.textButton}
                        onClick={handlePasswordReset}
                        disabled={pending}
                      >
                        Forgot password?
                      </button>
                    </div>
                  ) : null}
                </div>

                {mode === "register" ? (
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="confirmPassword">
                      Confirm password <span className={styles.req}>*</span>
                    </label>
                    <div className={styles.inputWrap}>
                      <Lock size={16} className={styles.inputIcon} aria-hidden="true" />
                      <input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        className={styles.input}
                        placeholder="Re-enter your password"
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
                      <span id="confirmPassword-error" className={styles.fieldError} role="alert">
                        {fieldErrors.confirmPassword}
                      </span>
                    ) : null}
                  </div>
                ) : null}

                <div className={styles.actions}>
                  <button type="submit" className={styles.submitButton} disabled={pending}>
                    <span>
                      {pending ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
                    </span>
                    {!pending ? <ArrowRight size={16} aria-hidden="true" /> : null}
                  </button>
                </div>
              </form>

              <p className={styles.accountPrompt}>
                {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  type="button"
                  className={styles.textButton}
                  onClick={() => switchMode(mode === "signin" ? "register" : "signin")}
                >
                  {mode === "signin" ? "Create an account" : "Sign in"}
                </button>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
