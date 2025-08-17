import type { NextFunction, Request, Response } from "express";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import { AsyncHandler } from "../middlewares/AsyncHandler.middleware.js";
import { HTTPSTATUS } from "../config/Https.config.js";
import { Env } from "../config/env.config.js";
import { db } from "../db/index.js";
import { playlists, playlistSongs, songs, albums, type NewPlaylist, type Playlist } from "../db/schema.js";
import { eq, and } from "drizzle-orm";
import { getAuthHeaderForForwarding, type AuthenticationRequest } from "../middlewares/shared.middleware.js";

export const createPlaylist = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, description, isPublic, userId } = req.body;
    const file = (req as any).file as Express.Multer.File | undefined;

    if (!userId) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: "User ID is required"
      });
    }

    if (!name) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: "Playlist name is required"
      });
    }

    try {
      let thumbnailUrl = null;

      if (file) {
        try {
          const base64Data = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
          
          const cloudData = await cloudinary.uploader.upload(base64Data, {
            folder: "playlist-thumbnails",
            resource_type: "image",
            public_id: `playlist-thumbnail-${Date.now()}-${file.originalname.split(".")[0]}`,
            timeout: 120000,
            transformation: [
              { width: 300, height: 300, crop: "fill" },
              { quality: "auto", fetch_format: "auto" }
            ]
          });

          thumbnailUrl = cloudData.secure_url;
        } catch (uploadError) {
          console.error('Cloudinary upload error:', uploadError);
          return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
            message: "Failed to upload thumbnail",
            error: uploadError instanceof Error ? uploadError.message : "Unknown error"
          });
        }
      }

      const newPlaylist: NewPlaylist = {
        userId,
        name,
        description: description || null,
        isPublic: isPublic === 'true' || isPublic === true,
        thumbnail: thumbnailUrl,
      };

      const [createdPlaylist] = await db.insert(playlists).values(newPlaylist).returning();

      if (!createdPlaylist) {
        return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
          message: "Failed to create playlist"
        });
      }

      try {
        const authHeaders = getAuthHeaderForForwarding(req);
        
        const userServiceResponse = await axios.post(
          `${Env.USER_URL}/api/v1/users/playlists`,
          { playlistId: createdPlaylist.id },
          {
            headers: {
              'Content-Type': 'application/json',
              ...authHeaders
            },
            timeout: 5000
          }
        );

        console.log('User Service updated successfully:', userServiceResponse.data);
      } catch (userServiceError) {
        console.error('Failed to update User Service:', userServiceError);
        
        // Rollback: Delete the created playlist if user service update fails
        await db.delete(playlists).where(eq(playlists.id, createdPlaylist.id));
        
        // Also delete uploaded image from Cloudinary if it exists
        if (thumbnailUrl) {
          try {
            const publicId = thumbnailUrl.split('/').pop()?.split('.')[0];
            if (publicId) {
              await cloudinary.uploader.destroy(`playlist-thumbnails/${publicId}`);
            }
          } catch (deleteError) {
            console.error('Failed to delete image from Cloudinary:', deleteError);
          }
        }
        
        return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
          message: "Failed to create playlist: User service update failed",
          error: userServiceError instanceof Error ? userServiceError.message : "Unknown error"
        });
      }

      res.status(HTTPSTATUS.CREATED).json({
        message: "Playlist created successfully",
        data: createdPlaylist
      });

    } catch (error) {
      console.error('Playlist creation error:', error);
      res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
        message: "Failed to create playlist",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }
);

export const getUserPlaylists = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    if (!userId) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: "User ID is required"
      });
    }

    try {
      const userPlaylists = await db.select().from(playlists).where(eq(playlists.userId, userId));

      res.status(HTTPSTATUS.OK).json({
        message: "User playlists retrieved successfully",
        data: userPlaylists
      });
    } catch (error) {
      console.error('Get playlists error:', error);
      res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
        message: "Failed to retrieve playlists",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }
);

export const getPlaylistById = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { playlistId } = req.params;

    if (!playlistId) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: "Playlist ID is required"
      });
    }

    try {
      const [playlist] = await db.select().from(playlists).where(eq(playlists.id, parseInt(playlistId)));

      if (!playlist) {
        return res.status(HTTPSTATUS.NOT_FOUND).json({
          message: "Playlist not found"
        });
      }

      res.status(HTTPSTATUS.OK).json({
        message: "Playlist retrieved successfully",
        data: playlist
      });
    } catch (error) {
      console.error('Get playlist error:', error);
      res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
        message: "Failed to retrieve playlist",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }
);

export const getPlaylistSongs = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { playlistId } = req.params;

    if (!playlistId) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: "Playlist ID is required"
      });
    }

    try {
      // First verify the playlist exists
      const [playlist] = await db.select().from(playlists).where(eq(playlists.id, parseInt(playlistId)));

      if (!playlist) {
        return res.status(HTTPSTATUS.NOT_FOUND).json({
          message: "Playlist not found"
        });
      }

      // Get songs in the playlist with their details, ordered by position
      const playlistSongsData = await db
        .select({
          // Song details
          songId: songs.id,
          title: songs.title,
          artist: songs.artist,
          albumId: songs.albumId,
          thumbnail: songs.thumbnail,
          duration: songs.duration,
          audioUrl: songs.audioUrl,
          playCount: songs.playCount,
          genre: songs.genre,
          isActive: songs.isActive,
          createdAt: songs.createdAt,
          // Playlist song details
          position: playlistSongs.position,
          addedAt: playlistSongs.addedAt,
          // Album details
          albumTitle: albums.title,
          albumArtist: albums.artist,
          albumThumbnail: albums.thumbnail
        })
        .from(playlistSongs)
        .innerJoin(songs, eq(playlistSongs.songId, songs.id))
        .leftJoin(albums, eq(songs.albumId, albums.id))
        .where(eq(playlistSongs.playlistId, parseInt(playlistId)))
        .orderBy(playlistSongs.position);

      res.status(HTTPSTATUS.OK).json({
        message: "Playlist songs retrieved successfully",
        data: {
          playlist: {
            id: playlist.id,
            name: playlist.name,
            description: playlist.description,
            isPublic: playlist.isPublic,
            thumbnail: playlist.thumbnail,
            songsCount: playlistSongsData.length
          },
          songs: playlistSongsData.map(item => ({
            id: item.songId,
            title: item.title,
            artist: item.artist,
            albumId: item.albumId,
            thumbnail: item.thumbnail,
            duration: item.duration,
            audioUrl: item.audioUrl,
            playCount: item.playCount,
            genre: item.genre,
            isActive: item.isActive,
            createdAt: item.createdAt,
            position: item.position,
            addedAt: item.addedAt,
            album: item.albumId ? {
              id: item.albumId,
              title: item.albumTitle,
              artist: item.albumArtist,
              thumbnail: item.albumThumbnail
            } : null
          }))
        }
      });

    } catch (error) {
      console.error('Get playlist songs error:', error);
      res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
        message: "Failed to retrieve playlist songs",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }
);

export const addSongToPlaylist = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { playlistId } = req.params;
    const { songId, position, userId } = req.body;

    if (!userId) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: "User ID is required"
      });
    }

    if (!playlistId || !songId) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: "Playlist ID and Song ID are required"
      });
    }

    try {
      // Verify playlist belongs to user
      const [playlist] = await db.select().from(playlists).where(
        and(
          eq(playlists.id, parseInt(playlistId)),
          eq(playlists.userId, userId)
        )
      );

      if (!playlist) {
        return res.status(HTTPSTATUS.NOT_FOUND).json({
          message: "Playlist not found or access denied"
        });
      }

      // Get next position if not provided
      let songPosition = position;
      if (!songPosition) {
        const lastSongs = await db.select().from(playlistSongs)
          .where(eq(playlistSongs.playlistId, parseInt(playlistId)))
          .orderBy(playlistSongs.position)
          .limit(1);
        
        songPosition = lastSongs.length > 0 && lastSongs[0] ? lastSongs[0].position + 1 : 1;
      }

      const [addedSong] = await db.insert(playlistSongs).values({
        playlistId: parseInt(playlistId),
        songId: parseInt(songId),
        position: songPosition
      }).returning();

      res.status(HTTPSTATUS.CREATED).json({
        message: "Song added to playlist successfully",
        data: addedSong
      });

    } catch (error) {
      console.error('Add song to playlist error:', error);
      res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
        message: "Failed to add song to playlist",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }
);

export const deletePlaylist = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { playlistId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: "User ID is required"
      });
    }

    if (!playlistId) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: "Playlist ID is required"
      });
    }

    try {
      // Verify playlist belongs to user
      const [playlist] = await db.select().from(playlists).where(
        and(
          eq(playlists.id, parseInt(playlistId)),
          eq(playlists.userId, userId)
        )
      );

      if (!playlist) {
        return res.status(HTTPSTATUS.NOT_FOUND).json({
          message: "Playlist not found or access denied"
        });
      }

      // Delete playlist (cascade will handle playlist_songs)
      await db.delete(playlists).where(eq(playlists.id, parseInt(playlistId)));

      // Make API call to User Service to remove playlist ID from user's array
      try {
        const authHeaders = getAuthHeaderForForwarding(req);
        
        await axios.delete(
          `${Env.USER_URL}/api/v1/user/playlists/${playlistId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              ...authHeaders
            },
            timeout: 5000
          }
        );
      } catch (userServiceError) {
        console.error('Failed to update User Service on delete:', userServiceError);
        // Continue anyway since playlist is already deleted
      }

      res.status(HTTPSTATUS.OK).json({
        message: "Playlist deleted successfully"
      });

    } catch (error) {
      console.error('Delete playlist error:', error);
      res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
        message: "Failed to delete playlist",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }
);
