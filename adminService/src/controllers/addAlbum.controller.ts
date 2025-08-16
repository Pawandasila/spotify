import type { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../middlewares/AsyncHandler.middleware.js";
import { HTTPSTATUS } from "../config/Https.config.js";
import { albumSchema } from "../validator/album.validator.js";
import cloudinary from "../config/clodinary.js";
import { addAlbumService } from "../services/Album.service.js";

export const addAlbum = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Validate file first
    const file = req.file;
    if (!file) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: "Thumbnail is required",
        errorCode: "VALIDATION_ERROR"
      });
    }

    const albumData = albumSchema.parse(req.body);

    
    try {
      
      const base64Data = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      
      const cloudData = await cloudinary.uploader.upload(base64Data, {
        folder: "album",
        resource_type: "auto",
        public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
        timeout: 60000,
      });


      const data = {
        title: albumData.title,
        artist: albumData.artist,
        releaseDate: albumData.releaseDate.toISOString().split('T')[0] as string,
        description: albumData.description,
        thumbnail: cloudData.secure_url as string,
      };

      const result = await addAlbumService(data);

      return res.status(HTTPSTATUS.CREATED).json({
        message: "Album added successfully",
        album: result,
        cloudinaryData: {
          url: cloudData.secure_url,
          public_id: cloudData.public_id,
          folder: cloudData.folder
        }
      });
    } catch (cloudinaryError) {
      
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
      
      throw new Error(`Failed to upload image: ${errorMessage}`);
    }
  }
);