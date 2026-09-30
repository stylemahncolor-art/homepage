CREATE TABLE `news` (
	`slug` text PRIMARY KEY NOT NULL,
	`category` integer DEFAULT 0 NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`body` text DEFAULT '{}' NOT NULL,
	`image` text,
	`source` text,
	`status` text DEFAULT 'published' NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `page_content` (
	`page` text NOT NULL,
	`locale` text NOT NULL,
	`title` text DEFAULT '' NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`image` text,
	`updated_at` text NOT NULL,
	PRIMARY KEY(`page`, `locale`)
);
