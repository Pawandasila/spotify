import { pgTable, serial, varchar, date, timestamp, text, integer } from 'drizzle-orm/pg-core';

export const albums = pgTable('albums', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  artist: varchar('artist', { length: 255 }).notNull(),
  releaseDate: date('release_date').notNull(),
  description: text('description').notNull(),
  thumbnail: varchar('thumbnail', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const songs = pgTable('songs', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  artist: varchar('artist', { length: 255 }).notNull(),
  albumId: integer('album_id').references(() => albums.id),
  thumbnail: varchar('thumbnail', { length: 255 }),
  duration: varchar('duration', { length: 10 }).notNull(),
  audioUrl: varchar('audio_url', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export type Album = typeof albums.$inferSelect;
export type NewAlbum = typeof albums.$inferInsert;
export type Song = typeof songs.$inferSelect;
export type NewSong = typeof songs.$inferInsert;
