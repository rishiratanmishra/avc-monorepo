# AVC Pet Hospital — Test User Accounts & Credentials

This file contains credentials and instructions for testing different roles, workspaces, and authorization scopes across the AVC Pet Hospital platform.

---

## 1. Active Test Accounts

### 👑 Platform Administrator (Global / Platform Scope)
- **Email:** `admin@avcpethospital.com`
- **Password:** `AdminPassword123!`
- **Role:** `admin` (Global Platform Admin)
- **Scope:** `platform`
- **Landing URL:** `/manage/platform`
- **Permissions:**
  - `platform.hospitals.manage` (Create hospitals, update operational status: active/suspended/closed)
  - `platform.users.manage` (List users, create platform accounts, assign/revoke admin role)
  - `platform.audit.read`

---

### 🐾 Pet Parent / Client (Client Scope)
- **Email:** `aarav.sharma@example.com`
- **Password:** `Password123!`
- **Role:** `pet_owner` (Pet Parent)
- **Scope:** `client`
- **Landing URL:** `/client`
- **Capabilities:**
  - View personal profile and owned pets
  - Book and manage appointments
  - Read medical records linked to client relationship

---

## 2. Hospital Workspace Roles (Tenant Scoped)

Hospital roles are **membership-based** and scoped to an individual hospital workspace. They cannot be created as global roles.

| Role Code | Display Name | Scope / Permissions Summary |
| :--- | :--- | :--- |
| `hospital_owner` | Hospital Owner | Full control over the hospital tenant, members, and settings. |
| `hospital_admin` | Hospital Administrator | Operational admin: scheduling, members, clients, billing, inventory. Cannot write prescriptions/clinical notes. |
| `veterinarian` | Veterinarian (Doctor) | Clinical authority: read/write clinical records, issue prescriptions, manage clinical tasks. |
| `veterinary_technician` | Veterinary Technician | Clinical support: read records, delegated clinical tasks. No prescribing authority. |
| `veterinary_assistant` | Veterinary Assistant | Support: basic patient lookup, assigned care support tasks. |
| `receptionist` | Receptionist (Front Desk) | Appointments, scheduling, client and patient lookup. No clinical/billing write access. |
| `billing` | Accounts Personnel | Billing, invoices, payments, client lookup. No clinical record access. |

---

## 3. How to Test Multi-Hospital Workspaces End-to-End

### Step 1: Create a Hospital Workspace (as Platform Admin)
1. Sign in as `admin@avcpethospital.com` at `/login`.
2. Navigate to **Hospitals** (`/manage/platform/hospitals`).
3. Fill out the **Create hospital** form:
   - Hospital Name: `AVC Central Hospital`
   - URL Slug: `avc-central`
   - Owner Email: e.g. `owner@avcpethospital.com` (or your test email)
4. Submit the form. The hospital is created in `suspended` state and an owner invitation token is queued.

### Step 2: Accept Hospital Owner Invitation
1. Either click the link from the invitation email (or in development, copy the invitation token from the `hospital_invitations` table in MySQL).
2. Visit `/accept-invitation#token=<YOUR_TOKEN>` or open `/accept-invitation` and paste the token.
3. Sign in as the invited email.
4. Click **Accept invitation**.
5. The hospital status automatically transitions to `active`, and the user is granted `hospital_owner` membership.

### Step 3: Manage Hospital Staff & Roles (Inside Practice)
1. Sign in as the hospital owner or admin.
2. Select the hospital workspace from `/workspace`.
3. Open `/manage/practice/staff`.
4. Invite doctors, technicians, receptionists, or billing staff by email with their respective hospital roles.
5. Team members accept via `/accept-invitation` and can immediately collaborate within the hospital workspace.

---

## 4. Helpful CLI Commands

- **Re-provision or Reset Platform Admin:**
  ```bash
  yarn seed:admin
  ```
- **Apply Database Migrations:**
  ```bash
  yarn --cwd packages/database migrate
  ```
- **Run Local Development Servers:**
  ```bash
  yarn dev
  ```
