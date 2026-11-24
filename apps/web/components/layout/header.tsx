"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Container } from "./container";
import { NAV_LINKS } from "../../constants";
import { useAuth, getPanelPath, getRoleLabel } from "../../contexts/auth-context";
import { User, LogOut } from "lucide-react";
import styles from "./header.module.css";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    if (href.startsWith("/#")) {
      return false;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

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

          <nav className={styles.nav} aria-label="Main Navigation">
            {NAV_LINKS.map((link) => {
              const isActive = isActiveLink(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className={styles.actions}>
            {isAuthenticated && user ? (
              <div className={styles.userMenu}>
                <Link
                  href={getPanelPath(user.role)}
                  className={styles.portalLink}
                  title={`Open ${getRoleLabel(user.role)} Dashboard`}
                >
                  <div className={styles.avatarPill}>
                    <User size={14} className={styles.userIcon} aria-hidden="true" />
                    <span className={styles.userName}>{user.name.split(" ")[0]}</span>
                    <span className={styles.roleTag}>({getRoleLabel(user.role)})</span>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={logout}
                  className={styles.logoutBtn}
                  title="Sign out of account"
                  aria-label="Sign out"
                >
                  <LogOut size={14} aria-hidden="true" />
                </button>
              </div>
            ) : (
              <Link href="/login" className={styles.loginBtn}>
                <User size={14} aria-hidden="true" />
                <span>Login / Register</span>
              </Link>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
};
