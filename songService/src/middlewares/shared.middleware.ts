import type {NextFunction, Request, Response} from 'express';
import axios from 'axios'
import { HTTPSTATUS } from '../config/Https.config.js';
import { Env } from '../config/env.config.js';

export interface UserDocument{
    _id : string,
    name : string,
    email: string,
    password: string,
    profilePicture?: string | null;
    role: string,
    playlist: string[],
    comparePassword: (password: string) => Promise<boolean>;
    ommitPassword: () => Omit<UserDocument, "password">;
}

export interface AuthenticationRequest extends Request {
    user: UserDocument;
    authToken?: string | undefined; // Add auth token to request interface
}

export const isAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
     try {
        const authHeader = req.headers.authorization;
        const queryToken = req.query.authorization as string;
        
        let token: string | undefined;
        
        if (authHeader) {
            token = authHeader.split(" ")[1]; 
        } else if (queryToken) {
            token = queryToken;
        }

        if(!token) {
            res.status(HTTPSTATUS.UNAUTHORIZED).json({ 
                message: "Unauthorized! Please provide authentication token",
                errorCode: "NO_TOKEN"
            });
            return;
        }
        
        const response = await axios.get(`${Env.USER_URL}/api/v1/users/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const userData = response.data;

        // if (userData.data.role !== 'user') {
        //     res.status(HTTPSTATUS.FORBIDDEN).json({ 
        //         message: "Access denied. Admin role required.",
        //         errorCode: "INSUFFICIENT_PERMISSIONS"
        //     });
        //     return;
        // }

        (req as AuthenticationRequest).user = userData;

        next();
    } catch (error) {
        
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                res.status(HTTPSTATUS.UNAUTHORIZED).json({ 
                    message: "Invalid or expired token",
                    errorCode: "INVALID_TOKEN"
                });
            } else if (error.response?.status === 404) {
                res.status(HTTPSTATUS.SERVICE_UNAVAILABLE).json({ 
                    message: "User authentication endpoint not found. Check if user service is properly configured.",
                    errorCode: "AUTH_ENDPOINT_NOT_FOUND"
                });
            } else if (error.code === 'ECONNREFUSED') {
                res.status(HTTPSTATUS.SERVICE_UNAVAILABLE).json({ 
                    message: "User service unavailable - connection refused",
                    errorCode: "SERVICE_UNAVAILABLE"
                });
            } else if (error.code === 'ENOTFOUND') {
                res.status(HTTPSTATUS.SERVICE_UNAVAILABLE).json({ 
                    message: "User service host not found",
                    errorCode: "SERVICE_HOST_NOT_FOUND"
                });
            } else {
                res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({ 
                    message: `Authentication service error: ${error.response?.status || 'Unknown'}`,
                    errorCode: "AUTH_SERVICE_ERROR"
                });
            }
        } else {
            res.status(HTTPSTATUS.UNAUTHORIZED).json({ 
                message: "Authentication failed",
                errorCode: "AUTH_FAILED"
            });
        }
        return;
    }
    
};

// Token forwarding middleware - extracts auth token and adds to request
export const extractAuthToken = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;
        const queryToken = req.query.authorization as string;
        
        let token: string | undefined;
        
        if (authHeader) {
            token = authHeader.split(" ")[1]; 
        } else if (queryToken) {
            token = queryToken;
        }

        // Add token to request object for easy forwarding
        (req as AuthenticationRequest).authToken = token;

        next();
    } catch (error) {
        // If token extraction fails, continue anyway (token might not be required)
        next();
    }
};

// Helper function to get authorization header for forwarding
export const getAuthHeaderForForwarding = (req: Request): { Authorization?: string } => {
    const token = (req as AuthenticationRequest).authToken;
    return token ? { Authorization: `Bearer ${token}` } : {};
};
