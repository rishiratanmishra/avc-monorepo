import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "./container";
import { Button } from "../ui/button";
import { NAV_LINKS, HOSPITAL_INFO } from "../../constants";
import { PhoneIcon } from "@heroicons/react/24/solid";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
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
              <PhoneIcon style={{ width: 14, height: 14, marginRight: 6, display: "inline-block", verticalAlign: "middle" }} aria-hidden="true" />
              <span>24/7 Emergency</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              href="http://localhost:3002"
              isExternal
            >
              <span>Staff Portal</span>
              <ArrowTopRightOnSquareIcon style={{ width: 13, height: 13, marginLeft: 5, display: "inline-block", verticalAlign: "middle" }} aria-hidden="true" />
            </Button>
          </div>
        </div>
      </Container>
    </header>
  );
};
