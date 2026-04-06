import express, { Request, Response } from "express";
import env from "../config/env.js";
import { ResponseObject } from "../types/Response.js";
import logger from "../utils/logger.js";

export default async function Logout(req: Request, res: Response) {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: "strict"
        });
        res.json({ message: "Logged user out successfully!", success: true } as ResponseObject);
        logger("User logged out successfully!", "info");
    } catch (error) {
        logger(JSON.stringify(error), "error");
    }
}
