import { pgTable, serial, varchar, text, integer, timestamp, boolean, date } from "drizzle-orm/pg-core";

// Albums table - shared with Admin Service
export const albums = pgTable("albums", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  artist: varchar("artist", { length: 255 }).notNull(),
  releaseDate: date("release_date").notNull(),
  description: text("description").notNull(),
  thumbnail: varchar("thumbnail", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Songs table - shared with Admin Service + streaming features
export const songs = pgTable("songs", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  artist: varchar("artist", { length: 255 }).notNull(),
  albumId: integer("album_id").references(() => albums.id),
  thumbnail: varchar("thumbnail", { length: 255 }),
  duration: varchar("duration", { length: 10 }).notNull(),
  audioUrl: varchar("audio_url", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  
  // Song Service specific fields for streaming
  playCount: integer("play_count").default(0),
  genre: varchar("genre", { length: 100 }),
  isActive: boolean("is_active").default(true),
});

// User playlists table
export const playlists = pgTable("playlists", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  isPublic: boolean("is_public").default(false),
  thumbnail: text("thumbnail"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// // Playlist songs junction table
export const playlistSongs = pgTable("playlist_songs", {
  id: serial("id").primaryKey(),
  playlistId: integer("playlist_id").notNull().references(() => playlists.id, { onDelete: "cascade" }),
  songId: integer("song_id").notNull().references(() => songs.id, { onDelete: "cascade" }),
  position: integer("position").notNull(),
  addedAt: timestamp("added_at").defaultNow(),
});

// // User listening history
// export const listeningHistory = pgTable("listening_history", {
//   id: serial("id").primaryKey(),
//   userId: varchar("user_id", { length: 255 }).notNull(),
//   songId: integer("song_id").notNull().references(() => songs.id, { onDelete: "cascade" }),
//   playedAt: timestamp("played_at").defaultNow(),
//   playDuration: integer("play_duration"),
//   completed: boolean("completed").default(false),
// });

// // User favorites
// export const favorites = pgTable("favorites", {
//   id: serial("id").primaryKey(),
//   userId: varchar("user_id", { length: 255 }).notNull(),
//   songId: integer("song_id").notNull().references(() => songs.id, { onDelete: "cascade" }),
//   addedAt: timestamp("added_at").defaultNow(),
// });

// Type exports
export type Album = typeof albums.$inferSelect;
export type NewAlbum = typeof albums.$inferInsert;

export type Song = typeof songs.$inferSelect;
export type NewSong = typeof songs.$inferInsert;

export type Playlist = typeof playlists.$inferSelect;
export type NewPlaylist = typeof playlists.$inferInsert;

export type PlaylistSong = typeof playlistSongs.$inferSelect;
export type NewPlaylistSong = typeof playlistSongs.$inferInsert;

// export type ListeningHistory = typeof listeningHistory.$inferSelect;
// export type NewListeningHistory = typeof listeningHistory.$inferInsert;

// export type Favorite = typeof favorites.$inferSelect;
// export type NewFavorite = typeof favorites.$inferInsert;
