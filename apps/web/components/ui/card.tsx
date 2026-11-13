import React from "react";
import { cn } from "../../lib/utils";
import styles from "./card.module.css";

export type CardProps = {
  hoverable?: boolean;
  elevated?: boolean;
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export const Card: React.FC<CardProps> = ({
  hoverable = false,
  elevated = true,
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        styles.card,
        hoverable && styles.hoverable,
        elevated && styles.elevated,
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
