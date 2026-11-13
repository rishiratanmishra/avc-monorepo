import React from "react";
import { cn } from "../../lib/utils";
import styles from "./container.module.css";

export type ContainerProps = {
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export const Container: React.FC<ContainerProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className={cn(styles.container, className)} {...props}>
      {children}
    </div>
  );
};
