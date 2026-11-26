"use client";

import { FormikForm, FormSubmitButton, InputTextField, zodValidationSchema } from "@repo/ui/form";
import { Alert } from "antd";
import { useState } from "react";
import { useCreateHospital } from "../../../hooks/platform/hospital-mutations";
import { apiErrorMessage } from "../../../lib/errors/api-error-message";
import {
  createHospitalFormSchema,
  emptyCreateHospitalValues,
  toCreateHospitalInput,
  type CreateHospitalFormValues,
} from "../../../lib/forms/hospital-form-schema";
import styles from "../../forms/form-layout.module.css";

export function CreateHospitalForm() {
  const createHospital = useCreateHospital();
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <FormikForm<CreateHospitalFormValues>
      className={styles.form}
      initialValues={emptyCreateHospitalValues}
      validationSchema={zodValidationSchema(createHospitalFormSchema)}
      describedBy={error ? "create-hospital-error" : notice ? "create-hospital-notice" : undefined}
      onSubmit={async (values, helpers) => {
        setNotice(null);
        setError(null);
        try {
          const hospital = await createHospital.mutateAsync(toCreateHospitalInput(values));
          setNotice(`${hospital.name} was created. The owner invitation will be sent by email.`);
          helpers.resetForm();
        } catch (requestError) {
          setError(apiErrorMessage(requestError));
        }
      }}
    >
      <div className={styles.grid}>
        <InputTextField
          name="name"
          label="Hospital name"
          required
          placeholder="AVC Pet Hospital"
          className={styles.full}
        />
        <InputTextField name="slug" label="URL slug" required placeholder="avc-pet-hospital" />
        <InputTextField
          name="ownerEmail"
          label="Owner email"
          required
          type="email"
          autoComplete="email"
          placeholder="owner@example.com"
        />
        <InputTextField name="addressLine1" label="Address line 1" className={styles.full} />
        <InputTextField name="city" label="City" />
        <InputTextField name="state" label="State" />
        <InputTextField name="postalCode" label="Postal code" />
        <InputTextField name="countryCode" label="Country code" placeholder="IN" />
        <InputTextField name="phone" label="Phone" type="tel" placeholder="+911234567890" />
      </div>

      {error ? (
        <Alert
          id="create-hospital-error"
          type="error"
          showIcon
          title={error}
          data-testid="create-hospital-error"
        />
      ) : null}
      {notice ? (
        <Alert
          id="create-hospital-notice"
          type="success"
          showIcon
          title={notice}
          data-testid="create-hospital-notice"
        />
      ) : null}

      <div className={styles.actions}>
        <FormSubmitButton className={styles.submit} pendingLabel="Creating…">
          Create hospital
        </FormSubmitButton>
      </div>
    </FormikForm>
  );
}
