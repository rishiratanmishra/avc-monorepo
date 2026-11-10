CREATE TABLE `roles` (
	`code` varchar(32) NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` varchar(500),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `roles_code` PRIMARY KEY(`code`)
);
--> statement-breakpoint
CREATE TABLE `user_profiles` (
	`user_id` varchar(36) NOT NULL,
	`first_name` varchar(100) NOT NULL,
	`last_name` varchar(100) NOT NULL,
	`preferred_name` varchar(100),
	`phone` varchar(16),
	`phone_verified_at` timestamp,
	`avatar_url` varchar(2048),
	`address_line_1` varchar(255),
	`address_line_2` varchar(255),
	`city` varchar(100),
	`state` varchar(100),
	`postal_code` varchar(20),
	`country_code` varchar(2),
	`locale` varchar(20) NOT NULL DEFAULT 'en-IN',
	`time_zone` varchar(64) NOT NULL DEFAULT 'Asia/Kolkata',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_profiles_user_id` PRIMARY KEY(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `user_roles` (
	`user_id` varchar(36) NOT NULL,
	`role_code` varchar(32) NOT NULL,
	`assigned_by_user_id` varchar(36),
	`assigned_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_roles_user_id_role_code_pk` PRIMARY KEY(`user_id`,`role_code`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(36) NOT NULL,
	`email` varchar(254) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	`status` enum('pending_verification','active','suspended','deactivated') NOT NULL DEFAULT 'pending_verification',
	`email_verified_at` timestamp,
	`password_changed_at` timestamp,
	`last_login_at` timestamp,
	`failed_login_attempts` int unsigned NOT NULL DEFAULT 0,
	`locked_until` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `user_profiles` ADD CONSTRAINT `user_profiles_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_roles` ADD CONSTRAINT `user_roles_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_roles` ADD CONSTRAINT `user_roles_role_code_roles_code_fk` FOREIGN KEY (`role_code`) REFERENCES `roles`(`code`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_roles` ADD CONSTRAINT `user_roles_assigned_by_user_id_users_id_fk` FOREIGN KEY (`assigned_by_user_id`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
INSERT INTO `roles` (`code`, `name`, `description`) VALUES
	('pet_owner', 'Pet owner', 'Can manage their own account, pets, and appointments.'),
	('veterinarian', 'Veterinarian', 'Clinical staff role; grant only with verified authorization.'),
	('receptionist', 'Receptionist', 'Can manage front-desk workflows as authorized.'),
	('staff', 'Staff', 'Non-clinical hospital staff role with explicitly granted access.'),
	('admin', 'Administrator', 'Privileged administrative access; never self-assigned at registration.');