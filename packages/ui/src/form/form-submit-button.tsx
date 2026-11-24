"use client";

import { useFormikContext } from "formik";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface FormSubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  pendingLabel?: string;
  icon?: ReactNode;
}

export function FormSubmitButton({
  children,
  pendingLabel,
  icon,
  disabled,
  ...buttonProps
}: FormSubmitButtonProps) {
  const { isSubmitting } = useFormikContext();

  return (
    <button {...buttonProps} type="submit" disabled={disabled || isSubmitting}>
      <span>{isSubmitting && pendingLabel ? pendingLabel : children}</span>
      {!isSubmitting && icon ? icon : null}
    </button>
  );
}
