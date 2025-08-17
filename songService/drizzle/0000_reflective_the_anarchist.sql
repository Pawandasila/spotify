CREATE TABLE "albums" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"artist" varchar(255) NOT NULL,
	"release_date" date NOT NULL,
	"description" text NOT NULL,
	"thumbnail" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "songs" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"artist" varchar(255) NOT NULL,
	"album_id" integer,
	"thumbnail" varchar(255),
	"duration" varchar(10) NOT NULL,
	"audio_url" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"play_count" integer DEFAULT 0,
	"genre" varchar(100),
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
ALTER TABLE "songs" ADD CONSTRAINT "songs_album_id_albums_id_fk" FOREIGN KEY ("album_id") REFERENCES "public"."albums"("id") ON DELETE no action ON UPDATE no action;