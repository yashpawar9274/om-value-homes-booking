CREATE TABLE `flat_tours` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`bhk_label` text NOT NULL,
	`object_key` text NOT NULL,
	`file_name` text NOT NULL,
	`content_type` text NOT NULL,
	`file_size` integer NOT NULL,
	`updated_at` text NOT NULL
);
