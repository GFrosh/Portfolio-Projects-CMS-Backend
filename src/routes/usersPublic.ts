import express from "express";
import getProjectsByUser from "../controllers/getProjectsByUser.js";

const router = express.Router();

router.get("/:username/projects", getProjectsByUser);

export default router;
