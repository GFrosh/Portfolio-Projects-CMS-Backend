import express from "express";
import getAllProjects from "../controllers/getProjects.js";
import addProject from "../controllers/addProjects.js";
import updateProject from "../controllers/updateProject.js";
import deleteProject from "../controllers/deleteProject.js";

const router = express.Router();

router.get("/", getAllProjects);
router.post("/new", addProject);
router.put("/edit/:id", updateProject);
router.delete("/delete/:id", deleteProject);

export default router;
