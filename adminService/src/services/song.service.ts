import { eq } from 'drizzle-orm';
import { db } from "../db/index.js";
import { songs, albums, type NewSong, type Song } from "../db/schema.js";

export const addSongService = async (songData: NewSong): Promise<Song> => {
  try {
    // First verify that the album exists
    if (songData.albumId) {
      const albumExists = await db.select({ id: albums.id })
        .from(albums)
        .where(eq(albums.id, songData.albumId))
        .limit(1);

      if (albumExists.length === 0) {
        throw new Error(`Album with ID ${songData.albumId} not found`);
      }
    }

    // Insert the new song
    const [newSong] = await db.insert(songs).values({
      title: songData.title,
      artist: songData.artist,
      albumId: songData.albumId,
      duration: songData.duration,
      audioUrl: songData.audioUrl,
      thumbnail: songData.thumbnail,
      genre: songData.genre,
      playCount: songData.playCount,
      isActive: songData.isActive,
    }).returning();

    if (!newSong) {
      throw new Error('Failed to create song');
    }

    return newSong;
  } catch (error) {
    throw error;
  }
};

// Get all songs for a specific album
export const getSongsByAlbumService = async (albumId: number): Promise<Song[]> => {
  try {
    return await db.select()
      .from(songs)
      .where(eq(songs.albumId, albumId));
  } catch (error) {
    throw error;
  }
};

// Get all songs with album information
export const getAllSongsWithAlbumsService = async () => {
  try {
    return await db.select({
      songId: songs.id,
      songTitle: songs.title,
      songArtist: songs.artist,
      duration: songs.duration,
      audioUrl: songs.audioUrl,
      songCreatedAt: songs.createdAt,
      albumId: albums.id,
      albumTitle: albums.title,
      albumArtist: albums.artist,
      albumThumbnail: albums.thumbnail,
    })
    .from(songs)
    .leftJoin(albums, eq(songs.albumId, albums.id));
  } catch (error) {
    throw error;
  }
};

// Update song thumbnail
export const updateSongThumbnailService = async (songId: number, thumbnailUrl: string): Promise<Song> => {
  try {
    const [updatedSong] = await db.update(songs)
      .set({ thumbnail: thumbnailUrl })
      .where(eq(songs.id, songId))
      .returning();

    if (!updatedSong) {
      throw new Error(`Song with ID ${songId} not found`);
    }

    return updatedSong;
  } catch (error) {
    throw error;
  }
};

export const deleteSongService = async (songId: number): Promise<Song> => {
  try {
    const [deletedSong] = await db.delete(songs)
      .where(eq(songs.id, songId))
      .returning();

    if (!deletedSong) {
      throw new Error(`Song with ID ${songId} not found`);
    }

    return deletedSong;
  } catch (error) {
    throw error;
  }
};

