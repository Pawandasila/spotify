import type { Request, Response, NextFunction } from "express";
import { AsyncHandler } from "../middlewares/AsyncHandler.middleware.js";
import { HTTPSTATUS } from "../config/Https.config.js";
import { deleteSongService } from "../services/song.service.js";
import { deleteAlbumService } from "../services/Album.service.js";

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