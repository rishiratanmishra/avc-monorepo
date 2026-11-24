"use client";

import type { ApplicationDestination } from "@repo/contracts";
import { ArrowRight, Building2, LayoutGrid, PawPrint } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { authErrorMessage } from "../../../lib/auth/auth-error-message";
import { selectWorkspaceInput, useLogoutUser, useSelectWorkspace } from "../../../hooks/auth";
import { Container } from "../../layout/container";
import { Footer } from "../../layout/footer";
import { Header } from "../../layout/header";
import { MobileActionBar } from "../../layout/mobile-action-bar";
import styles from "./workspace.module.css";

function destinationIcon(id: string) {
  if (id.startsWith("practice")) {
    return Building2;
  }
  if (id.startsWith("client")) {
    return PawPrint;
  }
  return LayoutGrid;
}

export function WorkspaceSelector({
  destinations,
  email,
  notice,
}: {
  destinations: ApplicationDestination[];
  email: string;
  notice: string | null;
}) {
  const selectWorkspaceMutation = useSelectWorkspace();
  const logoutMutation = useLogoutUser();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function choose(destination: ApplicationDestination) {
    setError(null);
    setPendingId(destination.id);
    try {
      await selectWorkspaceMutation.mutateAsync(selectWorkspaceInput(destination));
    } catch (cause) {
      setError(authErrorMessage(cause, "That workspace could not be selected. Try again."));
    } finally {
      setPendingId(null);
    }
  }

  return (
    <>
      <Header />
      <main className={styles.main}>
        <Container>
          <div className={styles.wrapper}>
            <span className={styles.eyebrow}>Account access</span>
            <h1 className={styles.title}>Choose your workspace</h1>
            <p className={styles.subtitle}>
              Signed in as <strong>{email}</strong>. Select the area you want to use for this
              session.
            </p>

            {notice ? (
              <p className={styles.notice} role="status">
                {notice}
              </p>
            ) : null}
            {error ? (
              <p className={styles.error} role="alert">
                {error}
              </p>
            ) : null}

            {destinations.length === 0 ? (
              <div className={styles.card}>
                <h2>No authorized workspace yet</h2>
                <p>
                  This account has no active hospital membership, client relationship, or platform
                  role. Ask your administrator to grant access, or continue to the public site.
                </p>
                <div className={styles.actions}>
                  <Link href="/" className={styles.secondaryAction}>
                    Back to website
                  </Link>
                  <button
                    type="button"
                    className={styles.secondaryAction}
                    onClick={() => void logoutMutation.mutateAsync().catch(() => undefined)}
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.grid}>
                {destinations.map((destination) => {
                  const Icon = destinationIcon(destination.id);
                  const isPending = pendingId === destination.id;
                  return (
                    <button
                      key={destination.id}
                      type="button"
                      className={styles.option}
                      onClick={() => void choose(destination)}
                      disabled={pendingId !== null}
                    >
                      <span className={styles.icon}>
                        <Icon size={22} aria-hidden="true" />
                      </span>
                      <span className={styles.optionBody}>
                        <strong>{destination.label}</strong>
                        <span>{destination.path}</span>
                      </span>
                      <ArrowRight size={18} aria-hidden="true" />
                      <span className={styles.srOnly}>
                        {isPending ? "Opening workspace" : "Open workspace"}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </Container>
      </main>
      <Footer />
      <MobileActionBar />
    </>
  );
}
