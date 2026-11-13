import React from "react";
import Link from "next/link";
import { cn } from "../../lib/utils";
import styles from "./button.module.css";

export type ButtonProps = {
  variant?: "primary" | "secondary" | "outline" | "emergency" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  isExternal?: boolean;
  className?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  href,
  isExternal,
  className,
  children,
  ...props
}) => {
  const combinedClass = cn(styles.button, styles[variant], styles[size], className);

  if (href) {
    if (isExternal) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={combinedClass}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={combinedClass}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClass} {...props}>
      {children}
    </button>
  );
};
