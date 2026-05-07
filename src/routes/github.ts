import express from "express";
import jwt from "jsonwebtoken";
import env from "../config/env.js";
import db from "../config/db.js";
import passport, { isGithubOAuthConfigured } from "../auth/githubStrategy.js";

const router = express.Router();

function getFrontendBaseUrl(): string {
    const configured = String(env.CLIENT_URL || "http://localhost:5173");
    return configured.split(",")[0].trim().replace(/\/$/, "");
}

function redirectWithError(res: express.Response, code: string) {
    const baseUrl = getFrontendBaseUrl();
    return res.redirect(`${baseUrl}/auth/callback?error=${encodeURIComponent(code)}`);
}

router.get("/github", (req, res, next) => {
    if (!isGithubOAuthConfigured) {
        return redirectWithError(res, "github_oauth_not_configured");
    }

    return passport.authenticate("github", { session: false })(req, res, next);
});

router.get("/github/callback", (req, res, next) => {
    if (!isGithubOAuthConfigured) {
        return redirectWithError(res, "github_oauth_not_configured");
    }

    return passport.authenticate("github", { session: false }, async (error: any, user: any) => {
        if (error || !user) {
            return redirectWithError(res, "github_auth_failed");
        }

        try {
            await db.query("UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1", [user.id]);

            const token = jwt.sign({ id: user.id, email: user.email }, env.JWT_SECRET, { expiresIn: "1d" });
            res.cookie("token", token, {
                httpOnly: true,
                secure: env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 24 * 60 * 60 * 1000
            });

            const baseUrl = getFrontendBaseUrl();
            return res.redirect(`${baseUrl}/auth/callback?token=${encodeURIComponent(token)}`);
        } catch {
            return redirectWithError(res, "github_auth_failed");
        }
    })(req, res, next);
});

export default router;
