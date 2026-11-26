"use client";

import { ASSIGNABLE_HOSPITAL_ROLE_CODES, type AssignableHospitalRoleCode } from "@repo/contracts";
import {
  FormikForm,
  FormSubmitButton,
  InputSelectField,
  InputTextField,
  zodValidationSchema,
} from "@repo/ui/form";
import { Alert } from "antd";
import { useState } from "react";
import { useInviteMember } from "../../../hooks/practice/staff-mutations";
import { apiErrorMessage } from "../../../lib/errors/api-error-message";
import {
  emptyInviteMemberValues,
  inviteMemberFormSchema,
  toInviteMemberInput,
  type InviteMemberFormValues,
} from "../../../lib/forms/invite-member-form-schema";
import styles from "../../forms/form-layout.module.css";

const ROLE_OPTIONS = ASSIGNABLE_HOSPITAL_ROLE_CODES.map((roleCode) => ({
  value: roleCode,
  label: roleCode
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" "),
}));

export function InviteMemberForm({ hospitalId }: { hospitalId: string }) {
  const inviteMember = useInviteMember(hospitalId);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <FormikForm<InviteMemberFormValues>
      className={styles.form}
      initialValues={emptyInviteMemberValues}
      validationSchema={zodValidationSchema(inviteMemberFormSchema)}
      describedBy={error ? "invite-member-error" : notice ? "invite-member-notice" : undefined}
      onSubmit={async (values, helpers) => {
        setNotice(null);
        setError(null);
        try {
          const result = await inviteMember.mutateAsync(
            toInviteMemberInput(values) as {
              email: string;
              roleCode: AssignableHospitalRoleCode;
            },
          );
          setNotice(result.message);
          helpers.setFieldValue("email", "");
        } catch (requestError) {
          setError(apiErrorMessage(requestError));
        }
      }}
    >
      <div className={styles.grid}>
        <InputTextField
          name="email"
          label="Email address"
          required
          type="email"
          autoComplete="email"
          placeholder="staff@example.com"
          className={styles.full}
        />
        <InputSelectField
          name="roleCode"
          label="Hospital role"
          required
          options={ROLE_OPTIONS}
          className={styles.full}
        />
      </div>

      {error ? <Alert id="invite-member-error" type="error" showIcon title={error} /> : null}
      {notice ? <Alert id="invite-member-notice" type="success" showIcon title={notice} /> : null}

      <div className={styles.actions}>
        <FormSubmitButton className={styles.submit} pendingLabel="Sending…">
          Send invitation
        </FormSubmitButton>
      </div>
    </FormikForm>
  );
}
