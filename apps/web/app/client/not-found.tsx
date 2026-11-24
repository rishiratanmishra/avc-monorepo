import Link from "next/link";
import styles from "../private-state.module.css";

export default function NotFound() {
  return (
    <main className={styles.state}>
      <h1>Workspace not found</h1>
      <p>This client workspace is not available for your account.</p>
      <Link href="/workspace">Choose another workspace</Link>
    </main>
  );
}
