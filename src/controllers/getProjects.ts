import db from "../config/db.js";
import { Request, Response } from "express";
import { ResponseObject } from "../types/Response.js";
import logger from "../utils/logger.js";

export default async function getAllProjects(req: Request, res: Response) {
    try {
        const result = await db.all("SELECT * FROM projects", []);
        res.json({ success: true, message: `Found ${result.length} projects`, data: result } as ResponseObject);
    } catch (error) {
        logger("Unable to get projects", "error");
        res.json({ success: false, message: "Error getting projects!" } as ResponseObject);
    }
}
