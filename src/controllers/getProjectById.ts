import db from "../config/db.js";
import { Request, Response } from "express";
import { ResponseObject } from "../types/Response.js";
import logger from "../utils/logger.js";

export default async function getProjectById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const project = await db.get("SELECT * FROM projects WHERE id = $1", [id]);
        if (!project) {
            res.status(404).json({ success: false, message: "Project not found" } as ResponseObject);
            return;
        }

        res.json({ success: true, message: "Project found", data: project } as ResponseObject);
    } catch (error) {
        logger(`Unable to get project by id: ${error}`, "error");
        res.status(500).json({ success: false, message: "Error fetching project" } as ResponseObject);
    }
}
