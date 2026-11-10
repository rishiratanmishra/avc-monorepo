CREATE TABLE `locations` (
	`id` varchar(36) NOT NULL,
	`name` varchar(120) NOT NULL,
	`slug` varchar(120) NOT NULL,
	`address` varchar(1000) NOT NULL,
	`phone` varchar(32),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `locations_id` PRIMARY KEY(`id`),
	CONSTRAINT `locations_slug_unique` UNIQUE(`slug`)
);
