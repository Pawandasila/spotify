import express from "express";
import { 
  getUserProfile, 
  loginUser, 
  registerUser,
  addPlaylistToUserController,
  removePlaylistFromUserController,
  getUserPlaylistsController
} from "../controllers/registerUser.controller.js";
import { IsAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get('/profile', IsAuthenticated , getUserProfile);

// Playlist management routes
router.post('/playlists', IsAuthenticated, addPlaylistToUserController);
router.delete('/playlists/:playlistId', IsAuthenticated, removePlaylistFromUserController);
router.get('/playlists', IsAuthenticated, getUserPlaylistsController);

export default router;