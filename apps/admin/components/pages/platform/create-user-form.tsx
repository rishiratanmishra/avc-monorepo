"use client";

import {
  FormikForm,
  FormSubmitButton,
  InputPasswordField,
  InputSelectField,
  InputTextField,
  zodValidationSchema,
} from "@repo/ui/form";
import { Alert, Typography } from "antd";
import { useState } from "react";
import { useCreatePlatformUser } from "../../../hooks/platform/user-mutations";
import { apiErrorMessage } from "../../../lib/errors/api-error-message";
import {
  createUserFormSchema,
  emptyCreateUserValues,
  toAdminCreateUserInput,
  type CreateUserFormValues,
} from "../../../lib/forms/admin-user-form-schema";
import styles from "../../forms/form-layout.module.css";

const ROLE_OPTIONS = [
  { value: "pet_owner", label: "Pet parent" },
  { value: "admin", label: "Platform administrator" },
] as const;

export function CreateUserForm() {
  const createUser = useCreatePlatformUser();
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <FormikForm<CreateUserFormValues>
      className={styles.form}
      initialValues={emptyCreateUserValues}
      validationSchema={zodValidationSchema(createUserFormSchema)}
      describedBy={error ? "create-user-error" : notice ? "create-user-notice" : undefined}
      onSubmit={async (values, helpers) => {
        setNotice(null);
        setError(null);
        try {
          const user = await createUser.mutateAsync(toAdminCreateUserInput(values));
          setNotice(`${user.email} was created. A verification email has been queued.`);
          helpers.resetForm();
        } catch (requestError) {
          setError(apiErrorMessage(requestError));
        }
      }}
    >
      <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
        New accounts start with email verification pending. Hospital roles are assigned through a
        hospital membership, not through this form.
      </Typography.Paragraph>

      <div className={styles.grid}>
        <InputTextField name="firstName" label="First name" required autoComplete="given-name" />
        <InputTextField name="lastName" label="Last name" required autoComplete="family-name" />
        <InputTextField
          name="email"
          label="Email address"
          required
          type="email"
          autoComplete="email"
          className={styles.full}
        />
        <InputSelectField
          name="roleCode"
          label="Account role"
          required
          options={ROLE_OPTIONS.map((option) => ({ ...option }))}
          className={styles.full}
        />
        <InputPasswordField
          name="password"
          label="Temporary password"
          required
          autoComplete="new-password"
        />
        <InputPasswordField
          name="confirmPassword"
          label="Confirm password"
          required
          autoComplete="new-password"
        />
      </div>

      {error ? (
        <Alert id="create-user-error" type="error" showIcon title={error} role="alert" />
      ) : null}
      {notice ? (
        <Alert
          id="create-user-notice"
          type="success"
          showIcon
          title={notice}
          role="status"
          data-testid="create-user-notice"
        />
      ) : null}

      <div className={styles.actions}>
        <FormSubmitButton className={styles.submit} pendingLabel="Creating…">
          Create user
        </FormSubmitButton>
      </div>
    </FormikForm>
  );
}
