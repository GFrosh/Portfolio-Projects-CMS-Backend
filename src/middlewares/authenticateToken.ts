import logger from "../utils/logger.js";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import env from "../config/env.js";
import type { ResponseObject } from "../types/Response.js";

interface AuthenticatedRequest extends Request {
    user?: any;
}

export default function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = req.cookies.token || (authHeader && authHeader.split(' ')[1]) || req.headers['x-access-token'] as string;


    if (!token) {
        logger("Access token is missing", "warn");
        return res.status(401).json({ success: false, message: "Access token is missing" } as ResponseObject);
    }

    jwt.verify(token, env.JWT_SECRET, (err: any, user: any) => {
        if (err) {
            logger("Invalid access token", "error");
            return res.status(403).json({ success: false, message: "Invalid access token" } as ResponseObject);
        }
        req.user = user;
        res.json({ success: true, message: "Token authenticated successfully" } as ResponseObject);
        next();
    });
}
