import express from 'express';
import db from "../config/db.js";
import { Request, Response } from "express";
import { ResponseObject } from "../types/Response.js";
import logger from "../utils/logger.js";

export default async function getProject(req: Request, res: Response) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Project ID is required!"
            } as ResponseObject);
        }
        const project = await db.get("SELECT * FROM projects WHERE id = $1", [id]);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found!"
            } as ResponseObject);
        }
        res.json({ success: true, data: project } as ResponseObject);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching project!"
        } as ResponseObject);
    }
}
