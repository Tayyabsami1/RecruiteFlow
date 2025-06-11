import express from 'express';
import cors from "cors"
import cookieparser from 'cookie-parser'
import AuthRouter from "./Routes/auth.routes.js"
import jobRouter from './Routes/job.routes.js';
import recruiterRouter from './Routes/recruiter.routes.js';


import AdminUserRoute from './Routes/AdminRoutes/user.routes.js';
import AdminStatsRoute from './Routes/AdminRoutes/stats.routes.js';
import AdminJobsRoute from './Routes/AdminRoutes/jobs.routes.js';

import jobSeekerRouter from './Routes/jobseeker.routes.js';

import JobSeekerAIRouter from './Routes/JobseekerRoutes/Ai.routes.js';

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
app.use('/api/Admin/Stats',AdminStatsRoute);
app.use('/api/Admin/Jobs',AdminJobsRoute);

app.use('/api/jobseeker', jobSeekerRouter);
app.use('/api/jobseeker/ai',JobSeekerAIRouter);

app.use('/api/recruiter', recruiterRouter);

// To serve a path to view Resumes on the frontend 
// app.use('/uploads', express.static('uploads'));



export { app };