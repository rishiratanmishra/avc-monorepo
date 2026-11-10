CREATE TABLE `auth_sessions` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`token_hash` varchar(64) NOT NULL,
	`expires_at` timestamp NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`last_seen_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `auth_sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `auth_sessions_token_hash_unique` UNIQUE(`token_hash`)
);
--> statement-breakpoint
CREATE TABLE `auth_tokens` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`type` enum('email_verification','password_reset') NOT NULL,
	`token_hash` varchar(64) NOT NULL,
	`expires_at` timestamp NOT NULL,
	`consumed_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `auth_tokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `auth_tokens_token_hash_unique` UNIQUE(`token_hash`)
);
--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` varchar(36) NOT NULL,
	`actor_user_id` varchar(36),
	`target_user_id` varchar(36),
	`action` varchar(100) NOT NULL,
	`request_id` varchar(36) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `audit_logs_id` PRIMARY KEY(`id`),
	CONSTRAINT `audit_logs_request_id_action_unique` UNIQUE(`request_id`,`action`)
);
--> statement-breakpoint
CREATE TABLE `email_outbox` (
	`id` varchar(36) NOT NULL,
	`recipient` varchar(254) NOT NULL,
	`type` enum('email_verification','password_reset') NOT NULL,
	`encrypted_payload` varchar(512) NOT NULL,
	`status` enum('pending','processing','sent','failed') NOT NULL DEFAULT 'pending',
	`attempts` int unsigned NOT NULL DEFAULT 0,
	`available_at` timestamp NOT NULL DEFAULT (now()),
	`locked_at` timestamp,
	`sent_at` timestamp,
	`last_error` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `email_outbox_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `auth_sessions` ADD CONSTRAINT `auth_sessions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `auth_tokens` ADD CONSTRAINT `auth_tokens_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_actor_user_id_users_id_fk` FOREIGN KEY (`actor_user_id`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_target_user_id_users_id_fk` FOREIGN KEY (`target_user_id`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `auth_sessions_user_id_idx` ON `auth_sessions` (`user_id`);--> statement-breakpoint
CREATE INDEX `auth_sessions_expires_at_idx` ON `auth_sessions` (`expires_at`);--> statement-breakpoint
CREATE INDEX `auth_tokens_user_type_idx` ON `auth_tokens` (`user_id`,`type`);--> statement-breakpoint
CREATE INDEX `auth_tokens_expires_at_idx` ON `auth_tokens` (`expires_at`);--> statement-breakpoint
CREATE INDEX `audit_logs_actor_created_idx` ON `audit_logs` (`actor_user_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `audit_logs_target_created_idx` ON `audit_logs` (`target_user_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `audit_logs_action_created_idx` ON `audit_logs` (`action`,`created_at`);--> statement-breakpoint
CREATE INDEX `email_outbox_status_available_idx` ON `email_outbox` (`status`,`available_at`);--> statement-breakpoint
CREATE INDEX `email_outbox_locked_at_idx` ON `email_outbox` (`locked_at`);