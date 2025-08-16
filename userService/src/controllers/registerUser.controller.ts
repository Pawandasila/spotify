import type { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../middlewares/AsyncHandler.middleware.js";
import { UserLoginSchema, UserRegisterSchema } from "../validator/user.validator.js";
import { loginService, registerService } from "../services/user.service.js";
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