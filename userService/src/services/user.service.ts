import mongoose from "mongoose";
import { UserModel } from "../models/user.models.js";
import { NotFoundException, UnauthorizedException } from "../utils/AppError.js";
import type { LoginService, RegisterService } from "../validator/user.validator.js";
import jwt from "jsonwebtoken";
import { Env } from "../config/env.config.js";

export const registerService = async (body: RegisterService) => {
  const { email, name, password, role } = body;
  

  try {
    
      const existingUser = await UserModel.findOne({ email });

      if (existingUser) {
        throw new UnauthorizedException("User with this email already exists");
      }

      // Explicitly construct the user object to ensure role is set correctly
      const newUser = new UserModel({
        name,
        email,
        password,
        role: role, // Role will have default "user" from Zod if not provided
      });

      const token = jwt.sign(
        { userId: (newUser._id as any).toString() }, 
        Env.JWT_SECRET, 
        {
          expiresIn: Env.JWT_EXPIRES_IN,
        } as jwt.SignOptions
      );

      await newUser.save();

      return {
        user: newUser.ommitPassword(),
        accessToken: token,
      };

  } catch (error) {
    throw error;
  }
};

export const loginService = async (body: LoginService) => {
  try {
    const { email, password } = body;

    const user = await UserModel.findOne({ email });
    if (!user) throw new NotFoundException("User does not exists");

    const isPasswordValid = await user.comparePassword(password);

    if(!isPasswordValid){
        throw new UnauthorizedException("Invalid Access");
    }

    const token = jwt.sign(
        { userId: (user._id as any).toString() }, 
        Env.JWT_SECRET, 
        {
          expiresIn: Env.JWT_EXPIRES_IN,
        } as jwt.SignOptions
      );


    
    return {
        user : user.ommitPassword(),
        accessToken : token,
        expiresAt : Env.JWT_EXPIRES_IN
    }
  } catch (error) {
    throw error
  }
};

export const updateUserService = async (userId: string, updatedData: any) => {
  try {
    const user = await UserModel.findById(userId);
    if (!user) throw new NotFoundException("User not found");

    // Update user fields
    const updatedUser = await UserModel.findByIdAndUpdate(userId, updatedData, { new: true });
    if (!updatedUser) throw new NotFoundException("User not found");

    return updatedUser.ommitPassword();
  } catch (error) {
    throw error;
  }
};

export const addPlaylistToUser = async (userId: string, playlistId: string) => {
  try {
    const user = await UserModel.findById(userId);
    if (!user) throw new NotFoundException("User not found");

    // Check if playlist already exists in user's playlist array
    if (user.playlist.includes(playlistId)) {
      throw new UnauthorizedException("Playlist already exists in user's collection");
    }

    // Add playlist ID to user's playlist array
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $push: { playlist: playlistId } },
      { new: true }
    );

    if (!updatedUser) throw new NotFoundException("User not found");

    return updatedUser.ommitPassword();
  } catch (error) {
    throw error;
  }
};

export const removePlaylistFromUser = async (userId: string, playlistId: string) => {
  try {
    const user = await UserModel.findById(userId);
    if (!user) throw new NotFoundException("User not found");

    // Remove playlist ID from user's playlist array
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $pull: { playlist: playlistId } },
      { new: true }
    );

    if (!updatedUser) throw new NotFoundException("User not found");

    return updatedUser.ommitPassword();
  } catch (error) {
    throw error;
  }
};

export const getUserPlaylists = async (userId: string) => {
  try {
    const user = await UserModel.findById(userId);
    if (!user) throw new NotFoundException("User not found");

    return {
      userId: user._id,
      playlists: user.playlist
    };
  } catch (error) {
    throw error;
  }
};
