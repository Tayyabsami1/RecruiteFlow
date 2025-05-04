import {Router} from 'express';
import { GetReumeSkills, getRecommendedJobs } from '../../Controllers/JobseekerController/ai.controller.js';
import { verifyJWT } from '../../Middlewares/auth.middleware.js';
const AIRouter=Router();

// Route to extract skills from a user's resume
AIRouter.get("/resume-skills",verifyJWT,GetReumeSkills);

// Route to get recommended jobs for a job seeker
AIRouter.get('/recommended-jobs/:jobSeekerId', verifyJWT,getRecommendedJobs);

export default AIRouter;