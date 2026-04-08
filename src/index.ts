import express, { Request as req, Response as res } from 'express';
import cors from 'cors';

import envs from './config/env.js';
import signupRoutes from './routes/signup.js';
import loginRoutes from './routes/login.js';
import logoutRoute from "./routes/logout.js";
import getAllUsersRoute from "./routes/users.js"

import logger from './utils/logger.js';

const app = express();
const PORT = parseInt(envs.PORT, 10) || 3000;
const whitelist = ["http://localhost:5173", envs.CLIENT_URL].filter(Boolean);
const corsOptions = {
  origin: function (origin: any, callback: (err: Error | null, allow?: boolean) => void) {
    if (!origin || whitelist.includes(origin)) {
      	callback(null, true);
    } else {
    	callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// ROUTES
app.use("/api/auth", signupRoutes);
app.use("/api/auth", loginRoutes);
app.use("/api/auth", logoutRoute);
app.use("/api/auth", getAllUsersRoute);


app.get('/', (req, res) => {
  	res.send('Alive and kicking!');
});

app.listen(PORT, () => {
  	logger(`Server is running on http://localhost:${PORT}`, 'info');
});
