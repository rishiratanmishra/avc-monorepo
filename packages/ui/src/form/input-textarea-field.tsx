"use client";

import { useField } from "formik";
import type { ReactNode, TextareaHTMLAttributes } from "react";
import { cn } from "./class-names";
import styles from "./form-fields.module.css";

type FieldPresentationProps = {
  name: string;
  label: string;
  required?: boolean;
  hint?: ReactNode;
  id?: string;
  className?: string;
  inputClassName?: string;
};

export type InputTextAreaFieldProps = FieldPresentationProps &
  Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    "children" | "id" | "name" | "value" | "onChange" | "onBlur"
  >;

export function InputTextAreaField({
  name,
  label,
  required,
  hint,
  id,
  className,
  inputClassName,
  "aria-describedby": describedBy,
  ...textareaProps
}: InputTextAreaFieldProps) {
  const [field, meta] = useField<string>(name);
  const inputId = id ?? name;
  const error = meta.touched && meta.error ? meta.error : undefined;
  const errorId = `${inputId}-error`;
  const hintId = hint && !error ? `${inputId}-hint` : undefined;
  const describedByIds = [error ? errorId : null, hintId, describedBy].filter(Boolean).join(" ");

  return (
    <div className={cn(styles.field, className)}>
      <label htmlFor={inputId} className={styles.label}>
        {label} {required ? <span className={styles.required}>*</span> : null}
      </label>
      <textarea
        {...field}
        {...textareaProps}
        id={inputId}
        className={cn(styles.input, styles.textarea, inputClassName)}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedByIds || undefined}
      />
      {hintId ? (
        <span id={hintId} className={styles.hint}>
          {hint}
        </span>
      ) : null}
      {error ? (
        <span id={errorId} className={styles.error} role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}
