import type { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../middlewares/AsyncHandler.middleware.js";
import { HTTPSTATUS } from "../config/Https.config.js";
import { db } from "../db/index.js";
import { songs } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { cacheHelper } from "../config/redis.config.js";

// Toggle song active status (activate/deactivate)
export const toggleSongStatus = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { isActive } = req.body;

    try {
      const parsedSongId = id !== undefined ? Number(id) : NaN;

    //   if (isNaN(parsedSongId)) {
    //     return res.status(HTTPSTATUS.BAD_REQUEST).json({
    //       message: "Invalid songId provided",
    //       errorCode: "VALIDATION_ERROR"
    //     });
    //   }

      // Validate isActive parameter
      if (typeof isActive !== 'boolean') {
        return res.status(HTTPSTATUS.BAD_REQUEST).json({
          message: "isActive must be a boolean value",
          errorCode: "VALIDATION_ERROR"
        });
      }

      // Check if song exists
      const [existingSong] = await db.select().from(songs).where(eq(songs.id, parsedSongId));

      if (!existingSong) {
        return res.status(HTTPSTATUS.NOT_FOUND).json({
          message: "Song not found",
          errorCode: "NOT_FOUND"
        });
      }

      // Update song status
      const [updatedSong] = await db
        .update(songs)
        .set({ isActive })
        .where(eq(songs.id, parsedSongId))
        .returning();

      // Invalidate song-related caches
      const cacheKeysToInvalidate = [
        `song:${parsedSongId}`,
        "songs:all"
      ];
      
      if (existingSong.albumId) {
        cacheKeysToInvalidate.push(`album:${existingSong.albumId}:songs`);
      }
      
      for (const key of cacheKeysToInvalidate) {
        await cacheHelper.del(key);
      }
      console.log("🗑️ Invalidated song caches after status change");

      return res.status(HTTPSTATUS.OK).json({
        message: `Song ${isActive ? 'activated' : 'deactivated'} successfully`,
        song: updatedSong
      });

    } catch (error) {
      console.error("Error toggling song status:", error);
      return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
        message: "Failed to update song status",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
);

// Deactivate song (set isActive to false)
export const deactivateSong = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      const parsedSongId = id !== undefined ? Number(id) : NaN;

      if (isNaN(parsedSongId)) {
        return res.status(HTTPSTATUS.BAD_REQUEST).json({
          message: "Invalid songId provided",
          errorCode: "VALIDATION_ERROR"
        });
      }

      // Check if song exists
      const [existingSong] = await db.select().from(songs).where(eq(songs.id, parsedSongId));

      if (!existingSong) {
        return res.status(HTTPSTATUS.NOT_FOUND).json({
          message: "Song not found",
          errorCode: "NOT_FOUND"
        });
      }

      // Deactivate song
      const [updatedSong] = await db
        .update(songs)
        .set({ isActive: false })
        .where(eq(songs.id, parsedSongId))
        .returning();

      // Invalidate song-related caches
      const cacheKeysToInvalidate = [
        `song:${parsedSongId}`,
        "songs:all"
      ];
      
      if (existingSong.albumId) {
        cacheKeysToInvalidate.push(`album:${existingSong.albumId}:songs`);
      }
      
      for (const key of cacheKeysToInvalidate) {
        await cacheHelper.del(key);
      }
      console.log("🗑️ Invalidated song caches after deactivation");

      return res.status(HTTPSTATUS.OK).json({
        message: "Song deactivated successfully",
        song: updatedSong
      });

    } catch (error) {
      console.error("Error deactivating song:", error);
      return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
        message: "Failed to deactivate song",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
);

// Activate song (set isActive to true)
export const activateSong = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      const parsedSongId = id !== undefined ? Number(id) : NaN;

      if (isNaN(parsedSongId)) {
        return res.status(HTTPSTATUS.BAD_REQUEST).json({
          message: "Invalid songId provided",
          errorCode: "VALIDATION_ERROR"
        });
      }

      // Check if song exists
      const [existingSong] = await db.select().from(songs).where(eq(songs.id, parsedSongId));

      if (!existingSong) {
        return res.status(HTTPSTATUS.NOT_FOUND).json({
          message: "Song not found",
          errorCode: "NOT_FOUND"
        });
      }

      // Activate song
      const [updatedSong] = await db
        .update(songs)
        .set({ isActive: true })
        .where(eq(songs.id, parsedSongId))
        .returning();

      // Invalidate song-related caches
      const cacheKeysToInvalidate = [
        `song:${parsedSongId}`,
        "songs:all"
      ];
      
      if (existingSong.albumId) {
        cacheKeysToInvalidate.push(`album:${existingSong.albumId}:songs`);
      }
      
      for (const key of cacheKeysToInvalidate) {
        await cacheHelper.del(key);
      }
      console.log("🗑️ Invalidated song caches after activation");

      return res.status(HTTPSTATUS.OK).json({
        message: "Song activated successfully",
        song: updatedSong
      });

    } catch (error) {
      console.error("Error activating song:", error);
      return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
        message: "Failed to activate song",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
);
