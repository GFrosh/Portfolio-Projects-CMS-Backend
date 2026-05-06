import db from "../config/db.js";
import { Request, Response } from "express";
import { ResponseObject } from "../types/Response.js";
import logger from "../utils/logger.js";

export default async function addProject(req: Request, res: Response) {
    res.json({ success: false, message: "Not implemented yet!" } as ResponseObject);
}
