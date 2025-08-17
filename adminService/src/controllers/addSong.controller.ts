import type { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../middlewares/AsyncHandler.middleware.js";
import { HTTPSTATUS } from "../config/Https.config.js";
import { songSchema } from "../validator/song.validator.js";
import cloudinary from "../config/clodinary.js";
import { addSongService } from "../services/song.service.js";
import { Env } from "../config/env.config.js";
import { cacheHelper } from "../config/redis.config.js";

export const addSong = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const file = req.file;
    if (!file) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: "Audio file is required",
        errorCode: "VALIDATION_ERROR"
      });
    }

    const songData = songSchema.parse(req.body);

    try {     
      
      const base64Data = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      
      const cloudData = await cloudinary.uploader.upload(base64Data, {
        folder: "songs",
        resource_type: "auto",
        public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
        timeout: 120000
      });

      const data = {
        title: songData.title,
        artist: songData.artist,
        albumId: songData.albumId || null,
        duration: songData.duration,
        audioUrl: cloudData.secure_url as string,
        thumbnail: null,
        genre: songData.genre || null, 
        playCount: 0, 
        isActive: true, 
      };


      const result = await addSongService(data);


      // Invalidate song-related caches
      const cacheKeysToInvalidate = [
        "songs:all",
        `album:${data.albumId}:songs`
      ];
      
      for (const key of cacheKeysToInvalidate) {
        await cacheHelper.del(key);
      }

      return res.status(HTTPSTATUS.CREATED).json({
        message: "Song added successfully",
        song: result,
        cloudinaryData: {
          url: cloudData.secure_url,
          public_id: cloudData.public_id,
          folder: cloudData.folder,
        },
      });
    } catch (cloudinaryError) {
      console.error("Cloudinary upload failed:", cloudinaryError);

      let errorMessage = "Unknown error occurred";
      if (cloudinaryError instanceof Error) {
        errorMessage = cloudinaryError.message || cloudinaryError.toString();
      } else if (typeof cloudinaryError === "string") {
        errorMessage = cloudinaryError;
      } else if (cloudinaryError && typeof cloudinaryError === "object") {
        errorMessage =
          (cloudinaryError as any).error?.message ||
          (cloudinaryError as any).message ||
          JSON.stringify(cloudinaryError);
      }

      throw new Error(`Failed to upload audio: ${errorMessage}`);
    }
  }
);
