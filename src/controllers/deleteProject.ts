import db from "../config/db.js";
import { Request, Response } from "express";
import { ResponseObject } from "../types/Response.js";
import logger from "../utils/logger.js";

export default async function deleteProject(req: Request, res: Response) {
    try {
        const { id } = req.params;

        // Validate required fields
        if (!id) {
            res.status(400).json({ success: false, message: "Project ID is required!" } as ResponseObject);
            return;
        }

        // Check if project exists
        const existingProject = await db.get("SELECT id, title FROM projects WHERE id = $1", [id]);
        if (!existingProject) {
            res.status(404).json({ success: false, message: "Project not found!" } as ResponseObject);
            return;
        }

        // Delete project
        await db.query("DELETE FROM projects WHERE id = $1", [id]);

        logger(`Project ${id} (${existingProject.title}) deleted successfully`, "info");
        res.json({ success: true, message: "Project deleted successfully!" } as ResponseObject);
    } catch (error) {
        logger(`Unable to delete project: ${error}`, "error");
        res.status(500).json({ success: false, message: "Error deleting project!" } as ResponseObject);
    }
}
