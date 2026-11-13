import React from "react";
import { cn } from "../../lib/utils";
import styles from "./badge.module.css";

export type BadgeProps = {
  variant?: "teal" | "emergency" | "success" | "neutral";
  className?: string;
  children: React.ReactNode;
};

export const Badge: React.FC<BadgeProps> = ({
  variant = "teal",
  className,
  children,
}) => {
  return <span className={cn(styles.badge, styles[variant], className)}>{children}</span>;
};
