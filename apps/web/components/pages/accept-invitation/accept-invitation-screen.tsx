"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/auth-context";
import { useAcceptInvitation } from "../../../hooks/auth";
import { authErrorMessage } from "../../../lib/auth/auth-error-message";
import { Container } from "../../layout/container";
import { Footer } from "../../layout/footer";
import { Header } from "../../layout/header";
import styles from "./accept-invitation.module.css";

function extractTokenFromLocation(searchToken?: string): string {
  if (searchToken && searchToken.trim()) {
    return searchToken.trim();
  }
  if (typeof window === "undefined") {
    return "";
  }
  const hash = window.location.hash.replace(/^#/, "");
  if (!hash) {
    return "";
  }
  const params = new URLSearchParams(hash);
  return params.get("token") ?? "";
}

export function AcceptInvitationScreen({ initialToken }: { initialToken?: string }) {
  const { status, context } = useAuth();
  const acceptMutation = useAcceptInvitation();

  const [token, setToken] = useState<string>(() => extractTokenFromLocation(initialToken));
  const [error, setError] = useState<string | null>(null);
  const [acceptedRole, setAcceptedRole] = useState<string | null>(null);

  useEffect(() => {
    function onHashChange() {
      const extracted = extractTokenFromLocation();
      if (extracted) {
        setToken(extracted);
      }
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  async function handleAccept() {
    if (!token.trim()) {
      setError("Please provide a valid invitation token.");
      return;
    }

    setError(null);
    try {
      const result = await acceptMutation.mutateAsync(token.trim());
      setAcceptedRole(result.roleCode);
    } catch (cause) {
      setError(
        authErrorMessage(
          cause,
          "The invitation could not be accepted. It may be expired, invalid, or tied to another email.",
        ),
      );
    }
  }

  return (
    <>
      <Header />
      <main className={styles.main}>
        <Container>
          <div className={styles.wrapper}>
            <span className={styles.eyebrow}>Workspace Invitation</span>
            <h1 className={styles.title}>Join Hospital Workspace</h1>
            <p className={styles.subtitle}>
              Accept your invitation to collaborate in the AVC Hospital Management workspace.
            </p>

            {error ? (
              <p className={styles.error} role="alert">
                {error}
              </p>
            ) : null}

            {acceptedRole ? (
              <div className={styles.card}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                  <CheckCircle2 color="var(--md-sys-color-primary)" size={24} />
                  <h2>Invitation Accepted!</h2>
                </div>
                <p>
                  You are now an active team member with the role of <strong>{acceptedRole}</strong>.
                  You can now enter your authorized hospital workspace.
                </p>
                <div className={styles.actions}>
                  <Link href="/workspace?switch=1" className={styles.primaryAction}>
                    Go to workspace <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ) : status === "loading" ? (
              <div className={styles.card}>
                <p>Verifying session…</p>
              </div>
            ) : status === "unauthenticated" ? (
              <div className={styles.card}>
                <h2>Sign in required</h2>
                <p>
                  You must sign in with the invited email address to accept this invitation.
                </p>
                <div className={styles.actions}>
                  <Link
                    href={`/login${token ? `?reason=invitation` : ""}`}
                    className={styles.primaryAction}
                  >
                    Sign in to continue <ArrowRight size={16} />
                  </Link>
                  <Link href="/" className={styles.secondaryAction}>
                    Back to website
                  </Link>
                </div>
              </div>
            ) : (
              <div className={styles.card}>
                <h2>Confirm Invitation Acceptance</h2>
                <p>
                  Signed in as <strong>{context?.email}</strong>. Accepting will link this account to
                  the hospital workspace with the assigned permissions.
                </p>

                <div className={styles.inputGroup}>
                  <label htmlFor="invitationToken" className={styles.inputLabel}>
                    Invitation token
                  </label>
                  <input
                    id="invitationToken"
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Enter or paste invitation token"
                    className={styles.inputField}
                    disabled={acceptMutation.isPending}
                  />
                </div>

                <div className={styles.actions}>
                  <button
                    type="button"
                    onClick={handleAccept}
                    disabled={acceptMutation.isPending || !token.trim()}
                    className={styles.primaryAction}
                  >
                    {acceptMutation.isPending ? "Accepting…" : "Accept invitation"}
                    <ArrowRight size={16} />
                  </button>
                  <Link href="/workspace" className={styles.secondaryAction}>
                    Cancel
                  </Link>
                </div>
              </div>
            )}
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
