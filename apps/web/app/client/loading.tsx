import styles from "../private-state.module.css";

export default function Loading() {
  return (
    <main className={styles.state} aria-live="polite">
      <h1>Loading your workspace…</h1>
      <p>Checking the authorized session with the API.</p>
    </main>
  );
}
