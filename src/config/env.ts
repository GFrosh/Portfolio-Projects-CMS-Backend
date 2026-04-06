import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
    path: path.resolve(__dirname, '../../.env'),
    quiet: true
});

const required: string[] = [
    'PORT',
    'DB_URL',
    'JWT_SECRET'
];

for (const envVar of required) {
    if (!process.env[envVar]) {
        throw new Error(`Environment variable ${envVar} is required but cannot be found.`);
    }
}

const PORT = process.env.PORT as string;
const DB_URL = process.env.DB_URL as string;
const JWT_SECRET = process.env.JWT_SECRET as string;

export default {
	PORT,
	DB_URL,
	JWT_SECRET
};
