import express from 'express';
import { getJobSeekerIdByUserId,getJobSeekerProfile,updateJobSeekerProfile } from '../Controllers/jobseeker.controller.js';
import upload from '../Middlewares/upload.middleware.js';

const jobSeekerRouter = express.Router();

jobSeekerRouter.get("/getJobSeekerId/:userId", getJobSeekerIdByUserId);

// Get Jobseeker Profile
jobSeekerRouter.get('/get-profile/:userId', getJobSeekerProfile);

// Update Jobseeker Profile
jobSeekerRouter.put('/update-profile/:userId', upload.single('resume'), updateJobSeekerProfile);

export default jobSeekerRouter;
