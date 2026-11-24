"use client";

import {
  FormikForm,
  FormSubmitButton,
  InputPasswordField,
  InputTextField,
  zodValidationSchema,
} from "@repo/ui/form";
import type { FormikHelpers, FormikProps } from "formik";
import { ArrowLeft, ArrowRight, Lock, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "../../../app/login/login.module.css";
import { useAuth } from "../../../contexts/auth-context";
import { useLoginUser, useRegisterUser, useRequestPasswordReset } from "../../../hooks/auth";
import { authErrorMessage } from "../../../lib/auth/auth-error-message";
import {
  authFormInitialValues,
  registrationFormSchema,
  signInFormSchema,
  type AuthFormValues,
} from "../../../lib/auth/auth-form-schemas";

type Mode = "signin" | "register";

const reasonMessages: Record<string, string> = {
  expired: "Your session expired. Sign in again to continue.",
  revoked: "Your previous workspace is no longer available. Sign in to choose another.",
  forbidden: "That area is not available for this account.",
  unavailable: "The service is temporarily unavailable. Try again shortly.",
};

export function LoginScreen({ reason }: { reason?: string }) {
  const { status, context } = useAuth();
  const loginMutation = useLoginUser();
  const registerMutation = useRegisterUser();
  const resetMutation = useRequestPasswordReset();
  const [mode, setMode] = useState<Mode>("signin");
  const previousMode = useRef<Mode>(mode);
  const [formError, setFormError] = useState<string | null>(
    reason ? (reasonMessages[reason] ?? null) : null,
  );
  const [notice, setNotice] = useState<string | null>(null);

  const pending = loginMutation.isPending || registerMutation.isPending || resetMutation.isPending;

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
    setFormError(null);
    setNotice(null);
  }

  async function handleSubmit(values: AuthFormValues, helpers: FormikHelpers<AuthFormValues>) {
    setFormError(null);
    setNotice(null);

    try {
      if (mode === "signin") {
        await loginMutation.mutateAsync({
          email: values.email.trim(),
          password: values.password,
        });
      } else {
        const message = await registerMutation.mutateAsync({
          email: values.email.trim(),
          password: values.password,
          profile: {
            firstName: values.firstName.trim(),
            lastName: values.lastName.trim(),
            locale: "en-IN",
            timeZone: "Asia/Kolkata",
          },
        });
        setNotice(message);
        helpers.resetForm({ values: { ...values, password: "", confirmPassword: "" } });
      }
    } catch (error) {
      setFormError(authErrorMessage(error));
    }
  }

  async function handlePasswordReset(values: AuthFormValues, formik: FormikProps<AuthFormValues>) {
    setFormError(null);
    setNotice(null);

    const parsed = signInFormSchema.shape.email.safeParse(values.email);
    if (!parsed.success) {
      formik.setFieldTouched("email", true);
      formik.setFieldError("email", "Enter your email address first, then request a reset.");
      return;
    }

    try {
      setNotice(await resetMutation.mutateAsync({ email: parsed.data }));
    } catch (error) {
      setFormError(authErrorMessage(error));
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

              <FormikForm<AuthFormValues>
                key={mode}
                className={styles.form}
                initialValues={authFormInitialValues}
                validationSchema={
                  mode === "signin"
                    ? zodValidationSchema(signInFormSchema)
                    : zodValidationSchema(registrationFormSchema)
                }
                onSubmit={handleSubmit}
                describedBy={
                  formError ? "auth-form-error" : notice ? "auth-form-notice" : undefined
                }
              >
                {(formik) => (
                  <>
                    {mode === "register" ? (
                      <div className={styles.row}>
                        <InputTextField
                          name="firstName"
                          label="First name"
                          required
                          autoComplete="given-name"
                        />
                        <InputTextField
                          name="lastName"
                          label="Last name"
                          required
                          autoComplete="family-name"
                        />
                      </div>
                    ) : null}

                    <InputTextField
                      name="email"
                      label="Email address"
                      type="email"
                      placeholder="Enter your email"
                      required
                      autoComplete="email"
                      icon={<Mail size={16} />}
                    />

                    <div className={styles.passwordGroup}>
                      <InputPasswordField
                        name="password"
                        label="Password"
                        placeholder="Enter your password"
                        required
                        autoComplete={mode === "signin" ? "current-password" : "new-password"}
                        minLength={mode === "register" ? 15 : undefined}
                        icon={<Lock size={16} />}
                      />
                      {mode === "signin" ? (
                        <div className={styles.forgotRow}>
                          <button
                            type="button"
                            className={styles.textButton}
                            onClick={() => void handlePasswordReset(formik.values, formik)}
                            disabled={pending}
                          >
                            Forgot password?
                          </button>
                        </div>
                      ) : null}
                    </div>

                    {mode === "register" ? (
                      <InputPasswordField
                        name="confirmPassword"
                        label="Confirm password"
                        placeholder="Re-enter your password"
                        required
                        autoComplete="new-password"
                        icon={<Lock size={16} />}
                      />
                    ) : null}

                    <div className={styles.actions}>
                      <FormSubmitButton
                        className={styles.submitButton}
                        pendingLabel="Please wait…"
                        icon={<ArrowRight size={16} aria-hidden="true" />}
                      >
                        {mode === "signin" ? "Sign in" : "Create account"}
                      </FormSubmitButton>
                    </div>
                  </>
                )}
              </FormikForm>

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
