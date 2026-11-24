import Link from "next/link";
import styles from "../private-state.module.css";

export default function NotFound() {
  return (
    <main className={styles.state}>
      <h1>Workspace not found</h1>
      <p>No authorized workspace matches this address.</p>
      <Link href="/workspace">Return to workspace selection</Link>
    </main>
  );
}
