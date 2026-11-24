"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Container } from "./container";
import { NAV_LINKS } from "../../constants";
import { useAuth } from "../../contexts/auth-context";
import { useLogoutUser } from "../../hooks/auth";
import { LayoutGrid, LogOut, User } from "lucide-react";
import styles from "./header.module.css";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { status, context } = useAuth();
  const logoutMutation = useLogoutUser();

  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    if (href.startsWith("/#")) {
      return false;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const isAuthenticated = status === "authenticated" && context !== null;
  const dashboardPath = context?.activeDestination?.path ?? "/workspace";
  const destinationLabel = context?.activeDestination?.label ?? "Choose workspace";
  const displayName = context?.email.split("@")[0] ?? "Account";

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
            {isAuthenticated ? (
              <div className={styles.userMenu}>
                <a
                  href={dashboardPath}
                  className={styles.portalLink}
                  title={`Open ${destinationLabel}`}
                >
                  <div className={styles.avatarPill}>
                    <User size={14} className={styles.userIcon} aria-hidden="true" />
                    <span className={styles.userName}>{displayName}</span>
                    <span className={styles.roleTag}>({destinationLabel})</span>
                  </div>
                </a>

                <Link
                  href="/workspace?switch=1"
                  className={styles.logoutBtn}
                  title="Switch workspace"
                  aria-label="Switch workspace"
                >
                  <LayoutGrid size={14} aria-hidden="true" />
                </Link>

                <button
                  type="button"
                  onClick={() => void logoutMutation.mutateAsync().catch(() => undefined)}
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
