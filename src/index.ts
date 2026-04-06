import express, { Request as req, Response as res } from 'express';
import cors from 'cors';

import envs from './config/env.js';
import signupRoutes from './routes/signup.js';

import logger from './utils.ts/logger.js';

const app = express();
const PORT = parseInt(envs.PORT, 10) || 3000;

app.use(express.json());
app.use(cors());
app.use("/api/auth", signupRoutes);

app.get('/', (req, res) => {
  	res.send('Alive and kicking!');
});

app.listen(PORT, () => {
  	logger(`Server is running on http://localhost:${PORT}`, 'info');
});
