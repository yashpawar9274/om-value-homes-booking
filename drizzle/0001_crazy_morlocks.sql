CREATE TABLE `blog_posts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`excerpt` text NOT NULL,
	`category` text NOT NULL,
	`body` text NOT NULL,
	`seo_title` text NOT NULL,
	`seo_description` text NOT NULL,
	`cover_object_key` text,
	`cover_content_type` text,
	`published_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `blog_posts_slug_unique` ON `blog_posts` (`slug`);--> statement-breakpoint
CREATE TABLE `content_meta` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `customer_stories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`title` text NOT NULL,
	`story` text NOT NULL,
	`orientation` text NOT NULL,
	`image_object_key` text,
	`image_content_type` text,
	`sort_order` integer NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `founder_profiles` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`role` text NOT NULL,
	`headline` text NOT NULL,
	`bio` text NOT NULL,
	`image_object_key` text,
	`image_content_type` text,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `founder_projects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`stage` text NOT NULL,
	`title` text NOT NULL,
	`status` text NOT NULL,
	`description` text NOT NULL,
	`image_object_key` text,
	`image_content_type` text,
	`sort_order` integer NOT NULL,
	`updated_at` text NOT NULL
);
