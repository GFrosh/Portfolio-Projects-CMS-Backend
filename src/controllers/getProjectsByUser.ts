import db from "../config/db.js";
import { Request, Response } from "express";
import { ResponseObject } from "../types/Response.js";
import logger from "../utils/logger.js";

export default async function getProjectsByUser(req: Request, res: Response) {
    try {
        const { username } = req.params;
        
        // Verify user exists
        const user = await db.get("SELECT id, name FROM users WHERE name = $1", [username]);
        if (!user) {
            res.status(404).json({ success: false, message: `User "${username}" not found` } as ResponseObject);
            return;
        }

        const projects = await db.all(
            "SELECT * FROM projects WHERE created_by = $1 ORDER BY created_at DESC",
            [username]
        );
        res.json({ success: true, message: `Found ${projects.length} projects for user ${username}`, data: projects } as ResponseObject);
    } catch (error) {
        logger(`Unable to get projects by user: ${error}`, "error");
        res.status(500).json({ success: false, message: "Error fetching user's projects" } as ResponseObject);
    }
}

