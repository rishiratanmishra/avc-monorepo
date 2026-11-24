import type { AccessContext } from "@repo/contracts";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { Container } from "../../layout/container";
import { Footer } from "../../layout/footer";
import { Header } from "../../layout/header";
import { MobileActionBar } from "../../layout/mobile-action-bar";
import styles from "./client-home.module.css";

export function ClientHome({ context }: { context: AccessContext }) {
  const hospitalName = context.activeWorkspace.hospitalName ?? "Personal account";
  const permissions = context.activeWorkspace.permissions.filter((permission) =>
    permission.startsWith("client."),
  );

  return (
    <>
      <Header />
      <main className={styles.main}>
        <Container>
          <div className={styles.wrapper}>
            <span className={styles.eyebrow}>Pet parent portal</span>
            <h1 className={styles.title}>Your AVC client workspace</h1>
            <p className={styles.subtitle}>
              You are signed in as {context.email}. The active client context is {hospitalName}.
            </p>

            <div className={styles.grid}>
              <section className={styles.card}>
                <ShieldCheck size={24} aria-hidden="true" />
                <h2>Authorized session</h2>
                <p>
                  This page was loaded only because the API confirmed an active client destination.
                  The server rechecks that workspace on every protected request.
                </p>
              </section>
              <section className={styles.card}>
                <CheckCircle2 size={24} aria-hidden="true" />
                <h2>Available client actions</h2>
                {permissions.length > 0 ? (
                  <ul>
                    {permissions.map((permission) => (
                      <li key={permission}>{permission.replace("client.", "")}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No client permissions are active in this workspace.</p>
                )}
              </section>
            </div>

            <p className={styles.note}>
              Appointment booking, records, and pet profile workflows are delivered in the next
              milestone. No sample clinical data is shown here.
            </p>
          </div>
        </Container>
      </main>
      <Footer />
      <MobileActionBar />
    </>
  );
}
