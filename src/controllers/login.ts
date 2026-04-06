import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import env from "../config/env.js";
import logger from "../utils/logger.js";
import db from "../config/db.js";
import type { AuthCredentials } from "../types/Auth.js";
import type { ResponseObject } from "../types/Response.js";

export default async function login(req: Request, res: Response) {
    const { email, password }: AuthCredentials = req.body;

    try {
        const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        const userExists = result.rows[0];
        const correctPassword = await bcrypt.compare(password, userExists.password_hash);

        if (!userExists || !correctPassword) {
            return res.status(401).json({ success: false, message: "Invalid Credentials" } as ResponseObject);
        }

        const token = jwt.sign({ id: userExists.id, email: email }, env.JWT_SECRET, { expiresIn: "1d" });
        logger(`User ${email} logged in successfully`, "info");

        res.cookie("token", token, {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3600000
        });
        logger(`Token set for user ${email}`, "info");

        res.status(200).json({
            success: true,
            message: "Login Successful!",
            token,
            user: {
                id: userExists.id,
                email: userExists.email
            }
        } as ResponseObject);
    
    } catch (error) {
        res.status(500).json({ success: false, message: "Unable to login at the moment!" } as ResponseObject);
        logger("Error logging user in:", "error");
        console.log(error);
    }
}
