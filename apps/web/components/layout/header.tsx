import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "./container";
import { Button } from "../ui/button";
import { NAV_LINKS, HOSPITAL_INFO } from "../../constants";
import styles from "./header.module.css";

export const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.inner}>
          <Link href="/" className={styles.brand}>
            <Image
              src="/images/logo-avc-hospital.png"
              alt="AVC Pet Hospital Logo"
              width={180}
              height={44}
              priority
              className={styles.brandLogo}
            />
          </Link>

          <nav className={styles.nav}>
            {NAV_LINKS.map((link) => (
              <Link key={link.label} href={link.href} className={styles.navLink}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className={styles.actions}>
            <Button
              variant="emergency"
              size="sm"
              href={`tel:${HOSPITAL_INFO.emergencyPhone}`}
              isExternal
            >
              🚨 Emergency
            </Button>
            <Button
              variant="outline"
              size="sm"
              href="http://localhost:3002"
              isExternal
            >
              Staff Portal
            </Button>
          </div>
        </div>
      </Container>
    </header>
  );
};
