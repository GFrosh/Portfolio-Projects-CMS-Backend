import express from "express";
import getAllProjects from "../controllers/getProjects.js";
import addProject from "../controllers/addProjects.js";
import updateProject from "../controllers/updateProject.js";
import deleteProject from "../controllers/deleteProject.js";
import getProject from "../controllers/getProject.js";
import authenticateToken from "../middlewares/authenticateToken.js";

const router = express.Router();

router.get("/", getAllProjects);
router.post("/new", authenticateToken, addProject);

router.put("/edit/:id", authenticateToken, updateProject);
router.delete("/delete/:id", authenticateToken, deleteProject);

router.get("/:id", getProject);

export default router;
