CREATE TABLE `ai_history` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`question` text NOT NULL,
	`answer` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_ai_user_date` ON `ai_history` (`user_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `quiz_attempts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`formula_id` text NOT NULL,
	`answer` text NOT NULL,
	`correct` integer NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_attempts_user_date` ON `quiz_attempts` (`user_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `user_progress` (
	`user_id` text NOT NULL,
	`formula_id` text NOT NULL,
	`completed` integer DEFAULT 0 NOT NULL,
	`bookmarked` integer DEFAULT 0 NOT NULL,
	`reviewed` integer DEFAULT 0 NOT NULL,
	`due_at` text,
	`updated_at` text NOT NULL,
	PRIMARY KEY(`user_id`, `formula_id`)
);
