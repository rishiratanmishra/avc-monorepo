"use client";

import { useField } from "formik";
import type { SelectHTMLAttributes } from "react";
import { cn } from "./class-names";
import styles from "./form-fields.module.css";

export interface SelectOption {
  label: string;
  value: string;
}

type FieldPresentationProps = {
  name: string;
  label: string;
  options: SelectOption[];
  required?: boolean;
  placeholder?: string;
  id?: string;
  className?: string;
  inputClassName?: string;
};

export type InputSelectFieldProps = FieldPresentationProps &
  Omit<
    SelectHTMLAttributes<HTMLSelectElement>,
    "children" | "id" | "name" | "value" | "onChange" | "onBlur"
  >;

export function InputSelectField({
  name,
  label,
  options,
  required,
  placeholder,
  id,
  className,
  inputClassName,
  "aria-describedby": describedBy,
  ...selectProps
}: InputSelectFieldProps) {
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
        <select
          {...field}
          {...selectProps}
          id={inputId}
          className={cn(styles.input, styles.select, inputClassName)}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedByIds || undefined}
        >
          {placeholder ? <option value="">{placeholder}</option> : null}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {error ? (
        <span id={errorId} className={styles.error} role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}
