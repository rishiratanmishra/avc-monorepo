"use client";

import { useField } from "formik";
import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "./class-names";
import styles from "./form-fields.module.css";

type FieldPresentationProps = {
  name: string;
  label: string;
  required?: boolean;
  icon?: ReactNode;
  id?: string;
  className?: string;
  inputClassName?: string;
};

export type InputTextFieldProps = FieldPresentationProps &
  Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "children" | "id" | "name" | "value" | "onChange" | "onBlur"
  >;

export function InputTextField({
  name,
  label,
  required,
  icon,
  id,
  className,
  inputClassName,
  "aria-describedby": describedBy,
  ...inputProps
}: InputTextFieldProps) {
  const [field, meta] = useField<string>(name);
  const inputId = id ?? name;
  const error = meta.touched && meta.error ? meta.error : undefined;
  const errorId = `${inputId}-error`;
  const describedByIds = [error ? errorId : null, describedBy].filter(Boolean).join(" ");

  return (
    <div className={cn(styles.field, className)}>
      <label htmlFor={inputId} className={styles.label}>
        {label} {required ? <span className={styles.required}>*</span> : null}
      </label>
      <div className={styles.inputWrap}>
        {icon ? (
          <span className={styles.icon} aria-hidden="true">
            {icon}
          </span>
        ) : null}
        <input
          {...field}
          {...inputProps}
          id={inputId}
          className={cn(styles.input, inputClassName)}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedByIds || undefined}
        />
      </div>
      {error ? (
        <span id={errorId} className={styles.error} role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}
