import type { Request, Response, NextFunction } from "express";
import { AsyncHandler } from "../middlewares/AsyncHandler.middleware.js";
import { HTTPSTATUS } from "../config/Https.config.js";
import { deleteSongService } from "../services/song.service.js";
import { deleteAlbumService } from "../services/Album.service.js";
import { cacheHelper } from "../config/redis.config.js";

export const deleteSong = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { songId } = req.params;

    try {
      const parsedSongId = songId !== undefined ? Number(songId) : NaN;

      if (isNaN(parsedSongId)) {
        return res.status(HTTPSTATUS.BAD_REQUEST).json({
          message: "Invalid songId provided",
          errorCode: "VALIDATION_ERROR"
        });
      }

      await deleteSongService(parsedSongId);

      // Invalidate song-related caches
      const cacheKeysToInvalidate = [
        `song:${parsedSongId}`,
        "songs:all"
      ];
      
      // Use pattern to invalidate all album:*:songs caches since we don't know which album
      await cacheHelper.delPattern("album:*:songs");
      
      for (const key of cacheKeysToInvalidate) {
        await cacheHelper.del(key);
      }
      console.log("🗑️ Invalidated song caches after deletion");

      return res.status(HTTPSTATUS.OK).json({
        message: "Song deleted successfully"
      });
    } catch (error) {
      console.error("Error deleting song:", error);
      return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
        message: "Failed to delete song",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
);

export const deleteAlbum = AsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { albumId } = req.params;

        try {
            const parsedAlbumId = albumId !== undefined ? Number(albumId) : NaN;

            if (isNaN(parsedAlbumId)) {
                return res.status(HTTPSTATUS.BAD_REQUEST).json({
                    message: "Invalid albumId provided",
                    errorCode: "VALIDATION_ERROR"
                });
            }

            const deletedAlbum = await deleteAlbumService(parsedAlbumId);

            // Invalidate album and song-related caches
            const cacheKeysToInvalidate = [
                "albums:all",
                `album:${parsedAlbumId}:songs`,
                "songs:all"
            ];
            
            for (const key of cacheKeysToInvalidate) {
                await cacheHelper.del(key);
            }
            console.log("🗑️ Invalidated album and song caches after album deletion");

            return res.status(HTTPSTATUS.OK).json({
                message: "Album deleted successfully. Associated songs now have no album.",
                deletedAlbum: deletedAlbum
            });
        } catch (error) {
            console.error("Error deleting album:", error);
            return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
                message: "Failed to delete album",
                error: error instanceof Error ? error.message : String(error)
            });
        }
    }
)