CREATE TABLE `hospitals` (
	`id` varchar(36) NOT NULL,
	`name` varchar(120) NOT NULL,
	`slug` varchar(120) NOT NULL,
	`status` enum('active','suspended','closed') NOT NULL DEFAULT 'active',
	`address_line_1` varchar(255),
	`city` varchar(100),
	`state` varchar(100),
	`postal_code` varchar(20),
	`country_code` varchar(2),
	`phone` varchar(32),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `hospitals_id` PRIMARY KEY(`id`),
	CONSTRAINT `hospitals_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `hospital_clients` (
	`id` varchar(36) NOT NULL,
	`hospital_id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`status` enum('active','suspended','ended') NOT NULL DEFAULT 'active',
	`client_number` varchar(40),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `hospital_clients_id` PRIMARY KEY(`id`),
	CONSTRAINT `hospital_clients_hospital_user_unique` UNIQUE(`hospital_id`,`user_id`)
);
--> statement-breakpoint
CREATE TABLE `hospital_invitations` (
	`id` varchar(36) NOT NULL,
	`hospital_id` varchar(36) NOT NULL,
	`email` varchar(254) NOT NULL,
	`role_code` varchar(32) NOT NULL,
	`token_hash` varchar(64) NOT NULL,
	`status` enum('pending','accepted','revoked','expired') NOT NULL DEFAULT 'pending',
	`expires_at` timestamp NOT NULL,
	`consumed_at` timestamp,
	`invited_by_user_id` varchar(36) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `hospital_invitations_id` PRIMARY KEY(`id`),
	CONSTRAINT `hospital_invitations_token_hash_unique` UNIQUE(`token_hash`)
);
--> statement-breakpoint
CREATE TABLE `hospital_membership_roles` (
	`membership_id` varchar(36) NOT NULL,
	`role_code` varchar(32) NOT NULL,
	`assigned_by_user_id` varchar(36),
	`assigned_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `hospital_membership_roles_primary` PRIMARY KEY(`membership_id`,`role_code`)
);
--> statement-breakpoint
CREATE TABLE `hospital_memberships` (
	`id` varchar(36) NOT NULL,
	`hospital_id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`status` enum('invited','active','suspended','revoked') NOT NULL DEFAULT 'invited',
	`title` varchar(100),
	`invited_by_user_id` varchar(36),
	`activated_at` timestamp,
	`revoked_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `hospital_memberships_id` PRIMARY KEY(`id`),
	CONSTRAINT `hospital_memberships_hospital_user_unique` UNIQUE(`hospital_id`,`user_id`)
);
--> statement-breakpoint
CREATE TABLE `permissions` (
	`code` varchar(100) NOT NULL,
	`scope` enum('platform','hospital','client') NOT NULL,
	`description` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `permissions_code` PRIMARY KEY(`code`)
);
--> statement-breakpoint
CREATE TABLE `role_permissions` (
	`role_code` varchar(32) NOT NULL,
	`permission_code` varchar(100) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `role_permissions_primary` PRIMARY KEY(`role_code`,`permission_code`)
);
--> statement-breakpoint
ALTER TABLE `email_outbox` MODIFY COLUMN `type` enum('email_verification','password_reset','hospital_invitation') NOT NULL;--> statement-breakpoint
ALTER TABLE `auth_sessions` ADD `active_hospital_id` varchar(36);--> statement-breakpoint
ALTER TABLE `auth_sessions` ADD `active_scope` enum('platform','hospital','client');--> statement-breakpoint
ALTER TABLE `audit_logs` ADD `outcome` enum('success','denied','failure') DEFAULT 'success' NOT NULL;--> statement-breakpoint
ALTER TABLE `audit_logs` ADD `hospital_id` varchar(36);--> statement-breakpoint
ALTER TABLE `audit_logs` ADD `resource_type` varchar(64);--> statement-breakpoint
ALTER TABLE `audit_logs` ADD `resource_id` varchar(36);--> statement-breakpoint
ALTER TABLE `audit_logs` ADD `details` text;--> statement-breakpoint
ALTER TABLE `audit_logs` ADD `ip_address` varchar(45);--> statement-breakpoint
ALTER TABLE `audit_logs` ADD `user_agent` varchar(512);--> statement-breakpoint
ALTER TABLE `hospital_clients` ADD CONSTRAINT `hospital_clients_hospital_id_hospitals_id_fk` FOREIGN KEY (`hospital_id`) REFERENCES `hospitals`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `hospital_clients` ADD CONSTRAINT `hospital_clients_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `hospital_invitations` ADD CONSTRAINT `hospital_invitations_hospital_id_hospitals_id_fk` FOREIGN KEY (`hospital_id`) REFERENCES `hospitals`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `hospital_invitations` ADD CONSTRAINT `hospital_invitations_role_code_roles_code_fk` FOREIGN KEY (`role_code`) REFERENCES `roles`(`code`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `hospital_invitations` ADD CONSTRAINT `hospital_invitations_invited_by_user_id_users_id_fk` FOREIGN KEY (`invited_by_user_id`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `hospital_membership_roles` ADD CONSTRAINT `hospital_membership_roles_role_code_roles_code_fk` FOREIGN KEY (`role_code`) REFERENCES `roles`(`code`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `hospital_membership_roles` ADD CONSTRAINT `hospital_membership_roles_assigned_by_user_id_users_id_fk` FOREIGN KEY (`assigned_by_user_id`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `hospital_membership_roles` ADD CONSTRAINT `hospital_membership_roles_membership_fk` FOREIGN KEY (`membership_id`) REFERENCES `hospital_memberships`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `hospital_memberships` ADD CONSTRAINT `hospital_memberships_hospital_id_hospitals_id_fk` FOREIGN KEY (`hospital_id`) REFERENCES `hospitals`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `hospital_memberships` ADD CONSTRAINT `hospital_memberships_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `hospital_memberships` ADD CONSTRAINT `hospital_memberships_invited_by_user_id_users_id_fk` FOREIGN KEY (`invited_by_user_id`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_role_code_roles_code_fk` FOREIGN KEY (`role_code`) REFERENCES `roles`(`code`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_permission_code_permissions_code_fk` FOREIGN KEY (`permission_code`) REFERENCES `permissions`(`code`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `hospitals_status_idx` ON `hospitals` (`status`);--> statement-breakpoint
CREATE INDEX `hospital_clients_user_status_idx` ON `hospital_clients` (`user_id`,`status`);--> statement-breakpoint
CREATE INDEX `hospital_invitations_hospital_status_idx` ON `hospital_invitations` (`hospital_id`,`status`);--> statement-breakpoint
CREATE INDEX `hospital_invitations_email_idx` ON `hospital_invitations` (`email`);--> statement-breakpoint
CREATE INDEX `hospital_memberships_user_status_idx` ON `hospital_memberships` (`user_id`,`status`);--> statement-breakpoint
CREATE INDEX `hospital_memberships_hospital_status_idx` ON `hospital_memberships` (`hospital_id`,`status`);--> statement-breakpoint
CREATE INDEX `permissions_scope_idx` ON `permissions` (`scope`);--> statement-breakpoint
CREATE INDEX `role_permissions_permission_code_idx` ON `role_permissions` (`permission_code`);--> statement-breakpoint
ALTER TABLE `auth_sessions` ADD CONSTRAINT `auth_sessions_active_hospital_id_hospitals_id_fk` FOREIGN KEY (`active_hospital_id`) REFERENCES `hospitals`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_hospital_id_hospitals_id_fk` FOREIGN KEY (`hospital_id`) REFERENCES `hospitals`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `audit_logs_hospital_created_idx` ON `audit_logs` (`hospital_id`,`created_at`);
--> statement-breakpoint

INSERT IGNORE INTO roles (code, name, description, created_at) VALUES ('admin', 'admin', 'Seeded by identity access migration', NOW());
--> statement-breakpoint
INSERT IGNORE INTO roles (code, name, description, created_at) VALUES ('hospital_owner', 'hospital_owner', 'Seeded by identity access migration', NOW());
--> statement-breakpoint
INSERT IGNORE INTO roles (code, name, description, created_at) VALUES ('hospital_admin', 'hospital_admin', 'Seeded by identity access migration', NOW());
--> statement-breakpoint
INSERT IGNORE INTO roles (code, name, description, created_at) VALUES ('veterinarian', 'veterinarian', 'Seeded by identity access migration', NOW());
--> statement-breakpoint
INSERT IGNORE INTO roles (code, name, description, created_at) VALUES ('veterinary_technician', 'veterinary_technician', 'Seeded by identity access migration', NOW());
--> statement-breakpoint
INSERT IGNORE INTO roles (code, name, description, created_at) VALUES ('veterinary_assistant', 'veterinary_assistant', 'Seeded by identity access migration', NOW());
--> statement-breakpoint
INSERT IGNORE INTO roles (code, name, description, created_at) VALUES ('receptionist', 'receptionist', 'Seeded by identity access migration', NOW());
--> statement-breakpoint
INSERT IGNORE INTO roles (code, name, description, created_at) VALUES ('billing', 'billing', 'Seeded by identity access migration', NOW());
--> statement-breakpoint
INSERT IGNORE INTO roles (code, name, description, created_at) VALUES ('staff', 'staff', 'Seeded by identity access migration', NOW());
--> statement-breakpoint
INSERT IGNORE INTO roles (code, name, description, created_at) VALUES ('pet_owner', 'pet_owner', 'Seeded by identity access migration', NOW());
--> statement-breakpoint
INSERT IGNORE INTO permissions (code, scope, description, created_at) VALUES ('platform.hospitals.manage', 'platform', 'platform.hospitals.manage', NOW());
--> statement-breakpoint
INSERT IGNORE INTO permissions (code, scope, description, created_at) VALUES ('platform.users.manage', 'platform', 'platform.users.manage', NOW());
--> statement-breakpoint
INSERT IGNORE INTO permissions (code, scope, description, created_at) VALUES ('platform.audit.read', 'platform', 'platform.audit.read', NOW());
--> statement-breakpoint
INSERT IGNORE INTO permissions (code, scope, description, created_at) VALUES ('hospital.settings.manage', 'hospital', 'hospital.settings.manage', NOW());
--> statement-breakpoint
INSERT IGNORE INTO permissions (code, scope, description, created_at) VALUES ('hospital.members.manage', 'hospital', 'hospital.members.manage', NOW());
--> statement-breakpoint
INSERT IGNORE INTO permissions (code, scope, description, created_at) VALUES ('hospital.clients.read', 'hospital', 'hospital.clients.read', NOW());
--> statement-breakpoint
INSERT IGNORE INTO permissions (code, scope, description, created_at) VALUES ('hospital.schedule.manage', 'hospital', 'hospital.schedule.manage', NOW());
--> statement-breakpoint
INSERT IGNORE INTO permissions (code, scope, description, created_at) VALUES ('hospital.patients.read', 'hospital', 'hospital.patients.read', NOW());
--> statement-breakpoint
INSERT IGNORE INTO permissions (code, scope, description, created_at) VALUES ('hospital.records.read', 'hospital', 'hospital.records.read', NOW());
--> statement-breakpoint
INSERT IGNORE INTO permissions (code, scope, description, created_at) VALUES ('hospital.records.write', 'hospital', 'hospital.records.write', NOW());
--> statement-breakpoint
INSERT IGNORE INTO permissions (code, scope, description, created_at) VALUES ('hospital.clinical_tasks.manage', 'hospital', 'hospital.clinical_tasks.manage', NOW());
--> statement-breakpoint
INSERT IGNORE INTO permissions (code, scope, description, created_at) VALUES ('hospital.prescriptions.write', 'hospital', 'hospital.prescriptions.write', NOW());
--> statement-breakpoint
INSERT IGNORE INTO permissions (code, scope, description, created_at) VALUES ('hospital.billing.manage', 'hospital', 'hospital.billing.manage', NOW());
--> statement-breakpoint
INSERT IGNORE INTO permissions (code, scope, description, created_at) VALUES ('hospital.inventory.manage', 'hospital', 'hospital.inventory.manage', NOW());
--> statement-breakpoint
INSERT IGNORE INTO permissions (code, scope, description, created_at) VALUES ('client.profile.manage', 'client', 'client.profile.manage', NOW());
--> statement-breakpoint
INSERT IGNORE INTO permissions (code, scope, description, created_at) VALUES ('client.appointments.manage', 'client', 'client.appointments.manage', NOW());
--> statement-breakpoint
INSERT IGNORE INTO permissions (code, scope, description, created_at) VALUES ('client.records.read', 'client', 'client.records.read', NOW());
--> statement-breakpoint
INSERT IGNORE INTO role_permissions (role_code, permission_code, created_at) VALUES ('admin', 'platform.hospitals.manage', NOW());
--> statement-breakpoint
INSERT IGNORE INTO role_permissions (role_code, permission_code, created_at) VALUES ('admin', 'platform.users.manage', NOW());
--> statement-breakpoint
INSERT IGNORE INTO role_permissions (role_code, permission_code, created_at) VALUES ('admin', 'platform.audit.read', NOW());
--> statement-breakpoint
INSERT IGNORE INTO role_permissions (role_code, permission_code, created_at) VALUES ('hospital_owner', 'hospital.settings.manage', NOW());
--> statement-breakpoint
INSERT IGNORE INTO role_permissions (role_code, permission_code, created_at) VALUES ('hospital_owner', 'hospital.members.manage', NOW());
--> statement-breakpoint
INSERT IGNORE INTO role_permissions (role_code, permission_code, created_at) VALUES ('hospital_owner', 'hospital.clients.read', NOW());
--> statement-breakpoint
INSERT IGNORE INTO role_permissions (role_code, permission_code, created_at) VALUES ('hospital_owner', 'hospital.schedule.manage', NOW());
--> statement-breakpoint
INSERT IGNORE INTO role_permissions (role_code, permission_code, created_at) VALUES ('hospital_owner', 'hospital.patients.read', NOW());
--> statement-breakpoint
INSERT IGNORE INTO role_permissions (role_code, permission_code, created_at) VALUES ('hospital_owner', 'hospital.records.read', NOW());
--> statement-breakpoint
INSERT IGNORE INTO role_permissions (role_code, permission_code, created_at) VALUES ('hospital_owner', 'hospital.records.write', NOW());
--> statement-breakpoint
INSERT IGNORE INTO role_permissions (role_code, permission_code, created_at) VALUES ('hospital_owner', 'hospital.clinical_tasks.manage', NOW());
--> statement-breakpoint
INSERT IGNORE INTO role_permissions (role_code, permission_code, created_at) VALUES ('hospital_owner', 'hospital.prescriptions.write', NOW());
--> statement-breakpoint
INSERT IGNORE INTO role_permissions (role_code, permission_code, created_at) VALUES ('hospital_owner', 'hospital.billing.manage', NOW());
--> statement-breakpoint
INSERT IGNORE INTO role_permissions (role_code, permission_code, created_at) VALUES ('hospital_owner', 'hospital.inventory.manage', NOW());
--> statement-breakpoint
INSERT IGNORE INTO role_permissions (role_code, permission_code, created_at) VALUES ('hospital_admin', 'hospital.settings.manage', NOW());
--> statement-breakpoint
INSERT IGNORE INTO role_permissions (role_code, permission_code, created_at) VALUES ('hospital_admin', 'hospital.members.manage', NOW());
--> statement-breakpoint
INSERT IGNORE INTO role_permissions (role_code, permission_code, created_at) VALUES ('hospital_admin', 'hospital.clients.read', NOW());
--> statement-breakpoint
INSERT IGNORE INTO role_permissions (role_code, permission_code, created_at) VALUES ('hospital_admin', 'hospital.schedule.manage', NOW());
--> statement-breakpoint
INSERT IGNORE INTO role_permissions (role_code, permission_code, created_at) VALUES ('hospital_admin', 'hospital.patients.read', NOW());
--> statement-breakpoint
INSERT IGNORE INTO role_permissions (role_code, permission_code, created_at) VALUES ('hospital_admin', 'hospital.records.read', NOW());
--> statement-breakpoint
INSERT IGNORE INTO role_permissions (role_code, permission_code, created_at) VALUES ('hospital_admin', 'hospital.billing.manage', NOW());
--> statement-breakpoint
INSERT IGNORE INTO role_permissions (role_code, permission_code, created_at) VALUES ('hospital_admin', 'hospital.inventory.manage', NOW());
--> statement-breakpoint
INSERT IGNORE INTO role_permissions (role_code, permission_code, created_at) VALUES ('veterinarian', 'hospital.schedule.manage', NOW());
--> statement-breakpoint
INSERT IGNORE INTO role_permissions (role_code, permission_code, created_at) VALUES ('veterinarian', 'hospital.patients.read', NOW());
--> statement-breakpoint
INSERT IGNORE INTO role_permissions (role_code, permission_code, created_at) VALUES ('veterinarian', 'hospital.records.read', NOW());
--> statement-breakpoint
INSERT IGNORE INTO role_permissions (role_code, permission_code, created_at) VALUES ('veterinarian', 'hospital.records.write', NOW());
--> statement-breakpoint
INSERT IGNORE INTO role_permissions (role_code, permission_code, created_at) VALUES ('veterinarian', 'hospital.clinical_tasks.manage', NOW());
--> statement-breakpoint
INSERT IGNORE INTO role_permissions (role_code, permission_code, created_at) VALUES ('veterinarian', 'hospital.prescriptions.write', NOW());
--> statement-breakpoint
INSERT IGNORE INTO role_permissions (role_code, permission_code, created_at) VALUES ('veterinary_technician', 'hospital.patients.read', NOW());
--> statement-breakpoint
INSERT IGNORE INTO role_permissions (role_code, permission_code, created_at) VALUES ('veterinary_technician', 'hospital.records.read', NOW());
--> statement-breakpoint
INSERT IGNORE INTO role_permissions (role_code, permission_code, created_at) VALUES ('veterinary_technician', 'hospital.records.write', NOW());
--> statement-breakpoint
INSERT IGNORE INTO role_permissions (role_code, permission_code, created_at) VALUES ('veterinary_technician', 'hospital.clinical_tasks.manage', NOW());
--> statement-breakpoint
INSERT IGNORE INTO role_permissions (role_code, permission_code, created_at) VALUES ('veterinary_assistant', 'hospital.patients.read', NOW());
--> statement-breakpoint
INSERT IGNORE INTO role_permissions (role_code, permission_code, created_at) VALUES ('veterinary_assistant', 'hospital.clinical_tasks.manage', NOW());
--> statement-breakpoint
INSERT IGNORE INTO role_permissions (role_code, permission_code, created_at) VALUES ('receptionist', 'hospital.clients.read', NOW());
--> statement-breakpoint
INSERT IGNORE INTO role_permissions (role_code, permission_code, created_at) VALUES ('receptionist', 'hospital.schedule.manage', NOW());
--> statement-breakpoint
INSERT IGNORE INTO role_permissions (role_code, permission_code, created_at) VALUES ('receptionist', 'hospital.patients.read', NOW());
--> statement-breakpoint
INSERT IGNORE INTO role_permissions (role_code, permission_code, created_at) VALUES ('billing', 'hospital.clients.read', NOW());
--> statement-breakpoint
INSERT IGNORE INTO role_permissions (role_code, permission_code, created_at) VALUES ('billing', 'hospital.billing.manage', NOW());
--> statement-breakpoint
INSERT IGNORE INTO role_permissions (role_code, permission_code, created_at) VALUES ('pet_owner', 'client.profile.manage', NOW());
--> statement-breakpoint
INSERT IGNORE INTO role_permissions (role_code, permission_code, created_at) VALUES ('pet_owner', 'client.appointments.manage', NOW());
--> statement-breakpoint
INSERT IGNORE INTO role_permissions (role_code, permission_code, created_at) VALUES ('pet_owner', 'client.records.read', NOW());
