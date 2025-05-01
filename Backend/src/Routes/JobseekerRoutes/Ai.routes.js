import {Router} from 'express';
// import { GetReumeSkills } from '../../Controllers/JobseekerController/ai.controller.js';
import { GetReumeSkills } from '../../Controllers/JobseekerController/ai.controller.js';
import { verifyJWT } from '../../Middlewares/auth.middleware.js';
const AIRouter=Router();

// Route to extract skills from a user's resume
AIRouter.get("/resume-skills",verifyJWT,GetReumeSkills);

export default AIRouter;