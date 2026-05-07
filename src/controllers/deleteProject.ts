import db from "../config/db.js";
import { Request, Response } from "express";
import { ResponseObject } from "../types/Response.js";
import logger from "../utils/logger.js";

export default async function deleteProject(req: any, res: Response) {
    try {
        const { id } = req.params;
        const user = req.user?.email
            ? await db.get("SELECT name FROM users WHERE email = $1", [req.user.email])
            : null;
        const userName = user?.name || null;

        // Validate required fields
        if (!id) {
            res.status(400).json({ success: false, message: "Project ID is required!" } as ResponseObject);
            return;
        }

        // Check if project exists
        const existingProject = await db.get("SELECT id, title, created_by FROM projects WHERE id = $1", [id]);
        if (!existingProject) {
            res.status(404).json({ success: false, message: "Project not found!" } as ResponseObject);
            return;
        }

        // Verify ownership: allow delete if user created it
        if (existingProject.created_by && userName !== existingProject.created_by) {
            res.status(403).json({ success: false, message: "You can only delete your own projects" } as ResponseObject);
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
