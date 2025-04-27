import express from 'express';
import { completeJobSeekerProfile } from '../Controllers/jobseeker.controller.js';
import upload from '../Middlewares/upload.middleware.js';

const jobSeekerRouter = express.Router();

// POST route to complete Jobseeker profile
jobSeekerRouter.post('/complete-profile/:userId', upload.single('resume'), completeJobSeekerProfile);

export default jobSeekerRouter;
