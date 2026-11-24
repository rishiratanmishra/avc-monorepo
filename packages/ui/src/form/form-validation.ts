import type { z } from "zod";

export type FormValidationErrors = Record<string, string>;

/**
 * Adapts a Zod schema to Formik's `validate` / `validationSchema` contract.
 * Form schemas must use flat field paths so Formik receives field-level errors.
 */
export function zodValidationSchema<TValues>(schema: z.ZodType<TValues>) {
  return (values: unknown): FormValidationErrors => {
    const result = schema.safeParse(values);
    if (result.success) {
      return {};
    }

    const errors: FormValidationErrors = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string" && !errors[field]) {
        errors[field] = issue.message;
      }
    }
    return errors;
  };
}
