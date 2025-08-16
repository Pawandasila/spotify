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