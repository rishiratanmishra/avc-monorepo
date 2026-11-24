# Veterinary Hospital Domain Rules

## Purpose

Define the business invariants that all future domain code must follow. This document describes rules, not implementation. No product feature may be implemented from assumptions that contradict it.

## Core entities

| Entity           | Rule                                                                                                                           |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Owner / customer | One person may own multiple pets. Contact details belong to the owner, not the pet.                                            |
| Pet / patient    | Belongs to one or more owners through an explicit relationship. Species, breed, birth date, and identifiers are clinical data. |
| Veterinarian     | A staff identity with a professional profile, availability, and assignment history.                                            |
| Staff            | Role-scoped hospital worker; staff role alone does not grant clinical authority.                                               |
| Appointment      | Links owner, patient, service, veterinarian or resource, time window, campus, and status.                                      |
| Consultation     | Clinical encounter tied to an appointment or walk-in and a responsible veterinarian.                                           |
| Medical record   | Append-only clinical facts with author, timestamp, and amendment history.                                                      |
| Vaccination      | Patient-specific clinical event with due date and administerer.                                                                |
| Prescription     | Issued only by an authorized veterinarian and tied to a consultation.                                                          |
| Treatment        | Clinical procedure with consent, outcome, and responsible staff.                                                               |
| Billing          | Financial records linked to owner and services, never embedded in medical notes.                                               |
| Inventory        | Stock items with batch, expiry, location, and movement history.                                                                |

## Ownership and privacy

- Patient data is sensitive. Access must be role-scoped and audited.
- Owner consent is required before publishing, sharing, or exporting medical information.
- Marketing pages must not contain real patient identifiers.
- Demo or sample data must be clearly labeled.

## Appointment rules

- Appointments require a time range, not just a date.
- Availability is defined per veterinarian/resource and campus.
- Two appointments may not overlap for the same veterinarian or limited resource.
- Walk-ins must be explicitly represented, not silently converted into scheduled appointments.
- Appointment confirmation must not be shown unless persistence succeeded.
- Cancellation and no-show preserve history; do not hard-delete appointments.

## Appointment status model

Use a documented state machine. Proposed canonical states:

```text
requested -> confirmed -> checked_in -> in_consultation -> completed
requested -> rejected
confirmed -> cancelled
confirmed -> no_show
checked_in -> cancelled (with reason)
```

Rules:

- Only authorized roles may perform transitions.
- Every transition records actor, reason, and timestamp.
- `completed` appointments may create consultation records but must not be edited as appointments in place.
- Invalid transitions must be rejected server-side.

## Consultation and medical records

- A consultation belongs to a patient and a responsible veterinarian.
- Clinical notes are append-only; corrections are amendments.
- Medical history must be ordered by clinical time, not display time.
- Prescriptions require an authorized prescriber.
- Lab and imaging results require provenance and upload metadata.

## Billing and inventory

- Charges attach to owner accounts and reference services or consultations.
- Payments do not mutate clinical records.
- Inventory movement must be transactionally consistent with consumption.
- Expired stock must not be administered.

## Identity, tenancy, and membership invariants

- A `hospital` is the tenant root for staff, clients, patients, schedules, clinical records, billing, and inventory. A campus/location belongs to one hospital and is not a separate authorization tenant.
- A user is a single identity. A person may hold several global roles, several hospital memberships, several roles within one membership, and a separate client relationship with one or more hospitals.
- Global roles grant only platform or client authority. A global role never grants hospital data access.
- Hospital staff authority exists only while a `hospital_membership` is `active` and the session's active hospital matches that membership. Suspended or revoked memberships grant no authority.
- A `hospital_owner` is accountable for one hospital. Every hospital must retain at least one active owner; the final owner cannot be revoked or demoted by another hospital administrator.
- Hospital roles are not a clinical-license assertion. Only a veterinarian may prescribe or sign clinical records. Technicians and assistants perform only delegated, role-permitted clinical tasks.
- A pet parent is linked to a hospital through an explicit `hospital_client` relationship. Pet, appointment, and medical-record access must resolve through that relationship and explicit ownership, not through account creation alone.
- A user with both staff and client relationships has separate contexts. Selecting a hospital workspace activates only staff authority; client authority remains resource-scoped.
- Invitations grant no authority until the invited account accepts a single-use token whose email, hospital, and role are checked server-side.
- Every privileged or sensitive decision records actor, target, action, outcome, scope, and request identifier. Denials are auditable.
- Cross-hospital access is forbidden unless the actor holds an active membership for that hospital and the request uses the server-selected active workspace.

## Anti-patterns

- Self-assigned clinical roles.
- Treating a global role as hospital membership.
- Accepting a client-supplied hospital ID as authorization.
- Appointment creation without conflict checks.
- Success UI without persistence.
- Hard-coded patient names in production components.
- Hard deletion of medical history.
- Billing fields embedded in clinical notes.
- Unspecified status transitions.

## Before implementing any domain feature

1. Identify the entity and invariant in this document.
2. If missing, add the rule here first.
3. Define contracts in `@repo/contracts`.
4. Define schema and migrations in `@repo/database`.
5. Implement server-side service logic.
6. Add tests for the invariant.
7. Only then build UI.
