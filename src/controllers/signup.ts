import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import db from '../config/db.js';
import { AuthSignUpData } from '../types/Auth.js';

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

        res.status(201).json({ message: 'User created successfully', success: true });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
