import express from 'express';
import cors from "cors"
import cookieparser from 'cookie-parser'
import AuthRouter from "./Routes/auth.routes.js"
import jobRouter from './Routes/job.routes.js';

import AdminUserRoute from './Routes/AdminRoutes/user.routes.js';
const app = express();

// Some security options using Middlewares
app.use(express.json({ limit: "16kb" }));

// like to encode space to %20 or +
app.use(express.urlencoded({
    extended: true,
    limit: "16kb",
}))

app.use(cookieparser())

// Configuring the Middlewares
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

app.use("/api/Auth",AuthRouter);
app.use('/api/job', jobRouter);
app.use('/api/Admin/Users',AdminUserRoute);


export { app };