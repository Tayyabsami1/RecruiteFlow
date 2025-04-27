import express from 'express';
import { completeJobSeekerProfile,getJobSeekerIdByUserId } from '../Controllers/jobseeker.controller.js';
import upload from '../Middlewares/upload.middleware.js';

const jobSeekerRouter = express.Router();

// POST route to complete Jobseeker profile
jobSeekerRouter.post('/complete-profile/:userId', upload.single('resume'), completeJobSeekerProfile);
jobSeekerRouter.get("/getJobSeekerId/:userId", getJobSeekerIdByUserId);

export default jobSeekerRouter;
