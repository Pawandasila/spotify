import type { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../middlewares/AsyncHandler.middleware.js";
import { HTTPSTATUS } from "../config/Https.config.js";
import cloudinary from "../config/clodinary.js";
import { updateSongThumbnailService } from "../services/song.service.js";
import { z } from "zod";
import { cacheHelper } from "../config/redis.config.js";

// Validation schema for thumbnail update
const thumbnailSchema = z.object({
  songId: z.string().min(1, "Song ID is required")
});

export const addSongThumbnail = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const file = req.file;
    if (!file) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: "Thumbnail image is required",
        errorCode: "VALIDATION_ERROR"
      });
    }

    const { songId } = thumbnailSchema.parse(req.body);

    try {

      const base64Data = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      
      const cloudData = await cloudinary.uploader.upload(base64Data, {
        folder: "song-thumbnails",
        resource_type: "image",
        public_id: `thumbnail-${Date.now()}-${file.originalname.split(".")[0]}`,
        timeout: 120000,
        transformation: [
          { width: 300, height: 300, crop: "fill" },
          { quality: "auto", fetch_format: "auto" }
        ]
      });

      const result = await updateSongThumbnailService(parseInt(songId), cloudData.secure_url);

      // Invalidate song-related caches
      const cacheKeysToInvalidate = [
        `song:${songId}`,
        "songs:all"
      ];
      
      // Also invalidate album:songs cache if song has albumId
      if (result.albumId) {
        cacheKeysToInvalidate.push(`album:${result.albumId}:songs`);
      }
      
      for (const key of cacheKeysToInvalidate) {
        await cacheHelper.del(key);
      }
      console.log("🗑️ Invalidated song caches after updating thumbnail");

      return res.status(HTTPSTATUS.OK).json({
        message: "Song thumbnail updated successfully",
        song: result,
        cloudinaryData: {
          url: cloudData.secure_url,
          public_id: cloudData.public_id,
          folder: cloudData.folder
        }
      });
    } catch (cloudinaryError) {
      console.error("Cloudinary thumbnail upload failed:", cloudinaryError);
      
      let errorMessage = "Unknown error occurred";
      if (cloudinaryError instanceof Error) {
        errorMessage = cloudinaryError.message || cloudinaryError.toString();
      } else if (typeof cloudinaryError === 'string') {
        errorMessage = cloudinaryError;
      } else if (cloudinaryError && typeof cloudinaryError === 'object') {
        errorMessage = (cloudinaryError as any).error?.message || 
                     (cloudinaryError as any).message || 
                     JSON.stringify(cloudinaryError);
      }
      
      throw new Error(`Failed to upload thumbnail: ${errorMessage}`);
    }
  }
);
