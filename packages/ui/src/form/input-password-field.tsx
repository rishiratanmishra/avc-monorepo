"use client";

import { useField } from "formik";
import { useState, type InputHTMLAttributes, type ReactNode } from "react";
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

export type InputPasswordFieldProps = FieldPresentationProps &
  Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "children" | "id" | "name" | "type" | "value" | "onChange" | "onBlur"
  >;

export function InputPasswordField({
  name,
  label,
  required,
  icon,
  id,
  className,
  inputClassName,
  disabled,
  "aria-describedby": describedBy,
  ...inputProps
}: InputPasswordFieldProps) {
  const [field, meta] = useField<string>(name);
  const [visible, setVisible] = useState(false);
  const inputId = id ?? name;
  const error = meta.touched && meta.error ? meta.error : undefined;
  const errorId = `${inputId}-error`;
  const describedByIds = [error ? errorId : null, describedBy].filter(Boolean).join(" ");
  const action = visible ? "Hide" : "Show";

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
          disabled={disabled}
          type={visible ? "text" : "password"}
          className={cn(styles.input, styles.inputWithAction, inputClassName)}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedByIds || undefined}
        />
        <button
          type="button"
          className={styles.visibilityButton}
          onClick={() => setVisible((current) => !current)}
          disabled={disabled}
          aria-label={`${action} ${label.toLowerCase()}`}
          aria-pressed={visible}
        >
          {action}
        </button>
      </div>
      {error ? (
        <span id={errorId} className={styles.error} role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}
