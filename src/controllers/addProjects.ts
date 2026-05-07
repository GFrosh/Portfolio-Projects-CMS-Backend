import db from "../config/db.js";
import { Request, Response } from "express";
import { ResponseObject } from "../types/Response.js";
import logger from "../utils/logger.js";

export default async function addProject(req: any, res: Response) {
    try {
        const { title, description, longDescription, tags, githubUrl, demoUrl, imageUrl, status = "draft", featured = false } = req.body;
        const user = req.user?.email
            ? await db.get("SELECT name FROM users WHERE email = $1", [req.user.email])
            : null;
        const createdBy = user?.name || null;

        const normalizedTags = Array.isArray(tags)
            ? tags
            : typeof tags === "string"
                ? JSON.parse(tags)
                : [];
        const normalizedFeatured = typeof featured === "string" ? featured === "true" : Boolean(featured);

        // Validate required fields
        if (!title || !description) {
            res.status(400).json({ success: false, message: "Title and description are required!" } as ResponseObject);
            return;
        }

        if (!Array.isArray(normalizedTags)) {
            res.status(400).json({ success: false, message: "Tags must be an array!" } as ResponseObject);
            return;
        }

        // Validate status
        const validStatuses = ["draft", "published", "archived"];
        if (status && !validStatuses.includes(status)) {
            res.status(400).json({ success: false, message: "Invalid status value!" } as ResponseObject);
            return;
        }

        // Insert project
        const result = await db.get(
            `INSERT INTO projects 
                (title, description, long_description, tags, github_url, demo_url, image_url, status, featured, created_by, created_at, updated_at) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW()) 
            RETURNING *`,
            [title, description, longDescription, normalizedTags, githubUrl, demoUrl, imageUrl, status, normalizedFeatured, createdBy]
        );

        logger(`Project "${title}" created successfully with ID ${result.id}`, "info");
        res.status(201).json({ success: true, message: "Project created successfully!", data: result } as ResponseObject);
    } catch (error) {
        logger(`Unable to create project: ${error}`, "error");
        res.status(500).json({ success: false, message: "Error creating project!" } as ResponseObject);
    }
}
