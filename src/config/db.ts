import { Pool } from "pg";
import envs from "./env.js";
import logger from "../utils/logger.js";

const pool = new Pool({
    connectionString: envs.DB_URL,
	ssl: false
});

const db = {
	query: (text: string, params: any[]) => pool.query(text, params),

	get: async (text: string, params: any[]) => {
		const { rows } = await pool.query(text, params);
		return rows[0];
	},

	all: async (text: string, params: any[]) => {
		const { rows } = await pool.query(text, params);
		return rows;
	},

	pool
};


async function ensureTables() {
	await db.query(`
	CREATE TABLE IF NOT EXISTS users (
		id SERIAL PRIMARY KEY,
		name VARCHAR(255) NOT NULL,
		email VARCHAR(255) UNIQUE NOT NULL,
		password_hash VARCHAR(255) NOT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		last_login_at TIMESTAMP
	);

	CREATE TABLE IF NOT EXISTS projects (
	id SERIAL PRIMARY KEY,
	title VARCHAR(255) NOT NULL,
	description TEXT NOT NULL,
	long_description TEXT NOT NULL,
	tags TEXT[] NOT NULL,
	github_url VARCHAR(255) NOT NULL,
	demo_url VARCHAR(255) NOT NULL,
	image_url VARCHAR(255) NOT NULL,
	status VARCHAR(20) NOT NULL,
	featured BOOLEAN DEFAULT FALSE,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
	`, []);
	logger("Tables ensuredd!", "info");
}

async function init() {
	try {
		await ensureTables();
	} catch (error) {
		console.error("Unable to initialize database", error);
		process.exit(1);
	}
}

init();

export default db;
