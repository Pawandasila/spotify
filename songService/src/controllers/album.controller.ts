import type { Request, Response } from "express";
import { AsyncHandler } from "../middlewares/AsyncHandler.middleware.js";
import { db } from "../db/index.js";
import { HTTPSTATUS } from "../config/Https.config.js";
import { albums, songs } from "../db/schema.js";
import { eq, and } from "drizzle-orm";
import { cacheHelper } from "../config/redis.config.js";

export const getAllAlbum = AsyncHandler(async (req: Request, res: Response) => {
  try {
    const cacheKey = "albums:all";

    // Try to get from cache first
    const cachedData = await cacheHelper.get(cacheKey);
    if (cachedData) {
      return res.status(HTTPSTATUS.OK).json({
        success: true,
        message: "Albums retrieved successfully (cached)",
        data: cachedData,
        count: cachedData.length,
        cached: true,
      });
    }

    // If not in cache, fetch from database
    const albums_data = await db.select().from(albums);

    // Cache the result
    await cacheHelper.set(cacheKey, albums_data, 1800); // 30 minutes

    res.status(HTTPSTATUS.OK).json({
      success: true,
      message: "Albums retrieved successfully",
      data: albums_data,
      count: albums_data.length,
      cached: false,
    });
  } catch (error) {
    console.error("Error fetching albums:", error);
    res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to retrieve albums",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export const getAllSongs = AsyncHandler(async (req: Request, res: Response) => {
  try {
    const cacheKey = "songs:all";

    // Try to get from cache first
    const cachedData = await cacheHelper.get(cacheKey);
    if (cachedData) {
      return res.status(HTTPSTATUS.OK).json({
        success: true,
        message: "Songs retrieved successfully (cached)",
        data: cachedData,
        count: cachedData.length,
        cached: true,
      });
    }

    // If not in cache, fetch from database
    const songs_data = await db.select().from(songs);

    // Cache the result
    await cacheHelper.set(cacheKey, songs_data, 900); // 15 minutes

    res.status(HTTPSTATUS.OK).json({
      success: true,
      message: "Songs retrieved successfully",
      data: songs_data,
      count: songs_data.length,
      cached: false,
    });
  } catch (error) {
    console.error("Error fetching songs:", error);
    res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to retrieve songs",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export const getAllSongsByAlbum = AsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const albumIdParam = req.params.albumId;

      if (!albumIdParam) {
        return res.status(HTTPSTATUS.BAD_REQUEST).json({
          success: false,
          message: "Album ID is required",
        });
      }

      const albumId = parseInt(albumIdParam);

      if (isNaN(albumId)) {
        return res.status(HTTPSTATUS.BAD_REQUEST).json({
          success: false,
          message: "Invalid Album ID format",
        });
      }

      const cacheKey = `album:${albumId}:songs`;

      // Try to get from cache first
      const cachedData = await cacheHelper.get(cacheKey);
      if (cachedData) {
        return res.status(HTTPSTATUS.OK).json({
          success: true,
          message: "Songs retrieved successfully (cached)",
          ...cachedData,
          cached: true,
        });
      }

      // If not in cache, fetch from database
      const [album_data] = await db
        .select()
        .from(albums)
        .where(eq(albums.id, albumId));

      if (!album_data) {
        return res.status(HTTPSTATUS.NOT_FOUND).json({
          success: false,
          message: "Album not found",
        });
      }

      const songs_data = await db
        .select()
        .from(songs)
        .where(and(eq(songs.albumId, albumId), eq(songs.isActive, true)));

      const responseData = {
        album: {
          id: album_data.id,
          title: album_data.title,
          artist: album_data.artist,
          thumbnail: album_data.thumbnail,
        },
        data: songs_data,
        count: songs_data.length,
      };

      // Cache the result
      await cacheHelper.set(cacheKey, responseData, 600); // 10 minutes

      res.status(HTTPSTATUS.OK).json({
        success: true,
        message: "Songs retrieved successfully",
        ...responseData,
        cached: false,
      });
    } catch (error) {
      console.error("Error fetching songs by album:", error);
      res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to retrieve songs",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

export const getSongById = AsyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        success: false,
        message: "Song ID is required",
      });
    }

    const parsedSongId = parseInt(id);

    if (isNaN(parsedSongId)) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        success: false,
        message: "Invalid Song ID format",
      });
    }

    const cacheKey = `song:${parsedSongId}`;

    const cachedData = await cacheHelper.get(cacheKey);
    if (cachedData) {
      return res.status(HTTPSTATUS.OK).json({
        success: true,
        message: "Song retrieved successfully (cached)",
        data: cachedData,
        cached: true,
      });
    }

    const [song_data] = await db
      .select()
      .from(songs)
      .where(eq(songs.id, parsedSongId));

    if (!song_data) {
      return res.status(HTTPSTATUS.NOT_FOUND).json({
        success: false,
        message: "Song not found",
      });
    }

    // Cache the result
    await cacheHelper.set(cacheKey, song_data, 300);

    res.status(HTTPSTATUS.OK).json({
      success: true,
      message: "Song retrieved successfully",
      data: song_data,
      cached: false,
    });
  } catch (error) {
    console.error("Error fetching song by ID:", error);
    res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to retrieve song",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export const incrementPlayCount = AsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(HTTPSTATUS.BAD_REQUEST).json({
          success: false,
          message: "Song ID is required",
        });
      }

      const parsedSongId = parseInt(id);

      if (isNaN(parsedSongId)) {
        return res.status(HTTPSTATUS.BAD_REQUEST).json({
          success: false,
          message: "Invalid Song ID format",
        });
      }

      const [song_data] = await db
        .select()
        .from(songs)
        .where(and(eq(songs.id, parsedSongId), eq(songs.isActive, true)));

      if (!song_data) {
        return res.status(HTTPSTATUS.NOT_FOUND).json({
          success: false,
          message: "Song not found or inactive",
        });
      }

      const currentPlayCount = song_data.playCount || 0;
      const [updatedSong] = await db
        .update(songs)
        .set({ playCount: currentPlayCount + 1 })
        .where(eq(songs.id, parsedSongId))
        .returning();

      // Invalidate related caches after updating play count
      const cacheKeys = [
        `song:${parsedSongId}`,
        `album:${song_data.albumId}:songs`,
        "songs:all",
      ];

      for (const key of cacheKeys) {
        await cacheHelper.del(key);
      }

      res.status(HTTPSTATUS.OK).json({
        success: true,
        message: "Play count incremented successfully",
        data: updatedSong,
        previousCount: currentPlayCount,
        newCount: currentPlayCount + 1,
      });
    } catch (error) {
      console.error("Error incrementing play count:", error);
      res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to increment play count",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);
