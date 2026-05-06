import express from "express";
import getAllProjects from "../controllers/getProjects.js";
import addProject from "../controllers/addProjects.js";

const router = express.Router();

router.get("/", getAllProjects);
router.post("/new", addProject);

export default router;
