"use client";

import styles from "../private-state.module.css";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className={styles.state} role="alert">
      <h1>Unable to load the client workspace</h1>
      <p>The API could not confirm this session. Try again or return to workspace selection.</p>
      <button type="button" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
