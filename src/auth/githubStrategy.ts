import passport from "passport";
import { Strategy as GitHubStrategy, Profile } from "passport-github2";
import db from "../config/db.js";
import bcrypt from "bcryptjs";
import env from "../config/env.js";

const githubClientId = env.GITHUB_CLIENT_ID;
const githubClientSecret = env.GITHUB_CLIENT_SECRET;
const githubCallbackUrl = env.GITHUB_CALLBACK_URL;

export const isGithubOAuthConfigured = Boolean(githubClientId && githubClientSecret && githubCallbackUrl);

if (isGithubOAuthConfigured) {
    passport.use(
        new GitHubStrategy(
            {
                clientID: githubClientId,
                clientSecret: githubClientSecret,
                callbackURL: githubCallbackUrl,
                scope: ["user:email"]
            },
            async (
                accessToken: string,
                refreshToken: string,
                profile: Profile,
                done: (error: Error | null, user?: any) => void
            ) => {
                try {
                    const primaryEmail = profile.emails?.[0]?.value;

                    if (!primaryEmail) {
                        return done(new Error("GitHub account email is required"));
                    }

                    const existingUser = await db.get("SELECT * FROM users WHERE email = $1", [primaryEmail]);
                    if (existingUser) {
                        return done(null, existingUser);
                    }

                    const displayName = profile.displayName || profile.username || "GitHub User";
                    const randomPasswordSeed = `${profile.id}-${Date.now()}-${Math.random()}`;
                    const hashedPassword = await bcrypt.hash(randomPasswordSeed, 10);

                    await db.query(
                        `INSERT INTO users (name, email, password_hash, created_at)
                         VALUES ($1, $2, $3, CURRENT_TIMESTAMP)`,
                        [displayName, primaryEmail, hashedPassword]
                    );

                    const newUser = await db.get("SELECT * FROM users WHERE email = $1", [primaryEmail]);
                    return done(null, newUser);
                } catch (error) {
                    return done(error as Error);
                }
            }
        )
    );
}

export default passport;
