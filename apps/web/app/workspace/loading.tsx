import styles from "../private-state.module.css";

export default function Loading() {
  return (
    <main className={styles.state} aria-live="polite">
      <h1>Loading workspace options…</h1>
      <p>Reading your authorized destinations from the API.</p>
    </main>
  );
}
