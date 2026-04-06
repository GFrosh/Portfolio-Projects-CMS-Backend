import Logout from "../controllers/logout.js";
import express from "express";

const router = express.Router();

router.post("/logout", Logout);

export default router;
