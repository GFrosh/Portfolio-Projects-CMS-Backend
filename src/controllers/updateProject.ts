import db from "../config/db.js";
import { Request, Response } from "express";
import { ResponseObject } from "../types/Response.js";
import logger from "../utils/logger.js";

export default async function updateProject(req: any, res: Response) {
    try {
        const { id } = req.params;
        const { title, description, longDescription, tags, githubUrl, demoUrl, imageUrl, status, featured } = req.body;
        const user = req.user?.email
            ? await db.get("SELECT name FROM users WHERE email = $1", [req.user.email])
            : null;
        const userName = user?.name || null;

        const normalizedTags = Array.isArray(tags)
            ? tags
            : typeof tags === "string"
                ? JSON.parse(tags)
                : [];
        const normalizedFeatured = typeof featured === "string" ? featured === "true" : Boolean(featured);

        // Validate required fields
        if (!id || !title || !description) {
            res.status(400).json({ success: false, message: "Missing required fields!" } as ResponseObject);
            return;
        }

        if (!Array.isArray(normalizedTags)) {
            res.status(400).json({ success: false, message: "Tags must be an array!" } as ResponseObject);
            return;
        }

        // Check if project exists
        const existingProject = await db.get("SELECT id, created_by FROM projects WHERE id = $1", [id]);
        if (!existingProject) {
            res.status(404).json({ success: false, message: "Project not found!" } as ResponseObject);
            return;
        }

        // Verify ownership: allow update if user created it or is admin
        if (existingProject.created_by && userName !== existingProject.created_by) {
            res.status(403).json({ success: false, message: "You can only edit your own projects" } as ResponseObject);
            return;
        }

        // Update project
        const result = await db.get(
            `UPDATE projects SET 
                title = $1, 
                description = $2, 
                long_description = $3, 
                tags = $4, 
                github_url = $5, 
                demo_url = $6, 
                image_url = $7, 
                status = $8, 
                featured = $9, 
                updated_at = NOW() 
            WHERE id = $10 
            RETURNING *`,
            [title, description, longDescription, normalizedTags, githubUrl, demoUrl, imageUrl, status, normalizedFeatured, id]
        );

        logger(`Project ${id} updated successfully`, "info");
        res.json({ success: true, message: "Project updated successfully!", data: result } as ResponseObject);
    } catch (error) {
        logger(`Unable to update project: ${error}`, "error");
        res.status(500).json({ success: false, message: "Error updating project!" } as ResponseObject);
    }
}
