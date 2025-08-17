import express from "express";
import { upload } from "../config/clodinary.js";
import { extractAuthToken } from "../middlewares/shared.middleware.js";
import {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  getPlaylistSongs,
  addSongToPlaylist,
  deletePlaylist
} from "../controllers/playlist.controller.js";

const router = express.Router();

// Apply token extraction middleware to all routes
router.use(extractAuthToken);

// Create a new playlist (with optional thumbnail upload)
router.post("/", upload, createPlaylist);

// Get all playlists for specific user
router.get("/user/:userId", getUserPlaylists);

// Get specific playlist by ID
router.get("/:playlistId", getPlaylistById);

// Get songs in a specific playlist
router.get("/:playlistId/songs", getPlaylistSongs);

// Add song to playlist
router.post("/:playlistId/songs", addSongToPlaylist);

// Delete playlist
router.delete("/:playlistId", deletePlaylist);

export default router;
