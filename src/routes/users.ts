import express from "express";
import getAllUsers from "../controllers/getUsers.js";

const router = express.Router();

router.get("/users", getAllUsers);

export default router;
