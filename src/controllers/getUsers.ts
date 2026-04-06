import db from "../config/db.js";
import { Request, Response } from "express";
import { ResponseObject } from "../types/Response.js";
import logger from "../utils/logger.js";

export default async function getAllUsers(req: Request, res: Response) {
    try {
        const result = await db.all("SELECT * FROM users", []);
        res.json({ success: true, message: `Found ${result.length} users`, data: result } as ResponseObject);
    } catch (error) {
        logger("Unable to get users", "error");
        res.json({ success: false, message: "Error getting users!" } as ResponseObject);
    }
}
