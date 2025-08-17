import type { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../middlewares/AsyncHandler.middleware.js";
import { UserLoginSchema, UserRegisterSchema } from "../validator/user.validator.js";
import { 
  loginService, 
  registerService, 
  updateUserService, 
  addPlaylistToUser, 
  removePlaylistFromUser, 
  getUserPlaylists 
} from "../services/user.service.js";
import { HTTPSTATUS } from "../config/Https.config.js";
import type { AuthenticationRequest } from "../middlewares/auth.middleware.js";

export const registerUser = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {

    const body = await UserRegisterSchema.parseAsync(req.body);

    const result = await registerService(body);

    res
      .status(HTTPSTATUS.CREATED)
      .json({ message: "User registered successfully", data: result });
  }
);

export const loginUser = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {

    const body = await UserLoginSchema.parseAsync(req.body);

    const result = await loginService(body);

    res
      .status(HTTPSTATUS.OK)
      .json({ message: "User logged in successfully", data: result });
  }
);

export const getUserProfile = AsyncHandler(
  async (req: AuthenticationRequest, res: Response, next: NextFunction) => {

    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(HTTPSTATUS.OK)
      .json({ message: "User profile retrieved successfully", data: user });
  }
);

export const updateUserPlaylist = AsyncHandler(
  async (req: AuthenticationRequest, res: Response, next: NextFunction) => {

    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedData = req.body;

    // Update user playlist logic here
    // You can use a service function to handle the update logic
    const result = await updateUserService(user.id, updatedData);

    res
      .status(HTTPSTATUS.OK)
      .json({ message: "User playlist updated successfully", data: result });
  }
);

export const addPlaylistToUserController = AsyncHandler(
  async (req: AuthenticationRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { playlistId } = req.body;

    if (!playlistId) {
      return res.status(400).json({ message: "Playlist ID is required" });
    }

    const result = await addPlaylistToUser(user.id, playlistId);

    res
      .status(HTTPSTATUS.OK)
      .json({ message: "Playlist added to user successfully", data: result });
  }
);

export const removePlaylistFromUserController = AsyncHandler(
  async (req: AuthenticationRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { playlistId } = req.params;

    if (!playlistId) {
      return res.status(400).json({ message: "Playlist ID is required" });
    }

    const result = await removePlaylistFromUser(user.id, playlistId);

    res
      .status(HTTPSTATUS.OK)
      .json({ message: "Playlist removed from user successfully", data: result });
  }
);

export const getUserPlaylistsController = AsyncHandler(
  async (req: AuthenticationRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const result = await getUserPlaylists(user.id);

    res
      .status(HTTPSTATUS.OK)
      .json({ message: "User playlists retrieved successfully", data: result });
  }
);