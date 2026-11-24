"use client";

import {
  Formik,
  type FormikConfig,
  type FormikHelpers,
  type FormikProps,
  type FormikValues,
} from "formik";
import type { ReactNode } from "react";
import type { FormValidationErrors } from "./form-validation";

type ValidationFn<Values> = (
  values: Values,
) => FormValidationErrors | Promise<FormValidationErrors>;

export interface FormikFormProps<Values extends FormikValues> extends Omit<
  FormikConfig<Values>,
  "children" | "onSubmit" | "validate" | "validationSchema"
> {
  children: ReactNode | ((formik: FormikProps<Values>) => ReactNode);
  onSubmit: (values: Values, helpers: FormikHelpers<Values>) => void | Promise<unknown>;
  /** Result of `zodValidationSchema(schema)`. Formik receives it as `validate`. */
  validationSchema?: ValidationFn<Values>;
  className?: string;
  describedBy?: string;
}

export function FormikForm<Values extends FormikValues>({
  children,
  className,
  describedBy,
  validationSchema,
  ...config
}: FormikFormProps<Values>) {
  return (
    <Formik {...config} validate={validationSchema}>
      {(formik) => (
        <form
          className={className}
          onSubmit={formik.handleSubmit}
          noValidate
          aria-busy={formik.isSubmitting || undefined}
          aria-describedby={describedBy}
        >
          {typeof children === "function" ? children(formik) : children}
        </form>
      )}
    </Formik>
  );
}
