import express from "express";
import getPublicProjects from "../controllers/getPublicProjects.js";

const router = express.Router();

router.get("/projects", getPublicProjects);

export default router;
