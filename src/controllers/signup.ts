import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import db from '../config/db.js';
import { AuthSignUpData, AuthUser } from '../types/Auth.js';
import { ResponseObject } from '../types/Response.js';

export default async function register(req: Request, res: Response) {
    const { name, email, password }: AuthSignUpData = req.body;
    
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query(`
            INSERT INTO users (name, email, password_hash)
            VALUES ($1, $2, $3)
        `, [name, email, hashedPassword]);

        const newUser = await db.get("SELECT id, name, email, created_at FROM users WHERE email = $1", [email]);

        res.status(201).json({
            message: 'User created successfully',
            success: true,
            user: {
                id: newUser.id,
                name,
                email,
                createdAt: newUser.created_at,
                lastLoginAt: null
            } as AuthUser
        } as ResponseObject);
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({
            message: 'Internal server error',
            success: false
        } as ResponseObject);
    }
}
