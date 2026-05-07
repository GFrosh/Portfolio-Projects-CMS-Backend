import db from "../config/db.js";
import { Request, Response } from "express";
import { ResponseObject } from "../types/Response.js";
import logger from "../utils/logger.js";

export default async function getPublicProjects(req: Request, res: Response) {
    try {
        const projects = await db.all("SELECT * FROM projects WHERE status = $1 ORDER BY created_at DESC", ["published"]);
        res.json({ success: true, message: `Found ${projects.length} public projects`, data: projects } as ResponseObject);
    } catch (error) {
        logger(`Unable to get public projects: ${error}`, "error");
        res.status(500).json({ success: false, message: "Error fetching public projects" } as ResponseObject);
    }
}
