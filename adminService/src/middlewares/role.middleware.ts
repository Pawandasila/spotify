import type { NextFunction, Response } from "express";
import type { AuthenticationRequest } from "./Shared.middleware.js";
import { HTTPSTATUS } from "../config/Https.config.js";

export const checkRole = (role: string) => {
    return (req: AuthenticationRequest, res: Response, next: NextFunction) => {
        if (req.user && req.user.role === 'admin') {
            next();
        } else {
            res.status(HTTPSTATUS.FORBIDDEN).json({ message: 'Forbidden' });
        }
    };
};
