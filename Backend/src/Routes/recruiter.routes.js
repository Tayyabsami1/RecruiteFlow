import express from 'express';
import {
  getRecruiterIdByUserId,
  getRecruiterProfile,
  updateRecruiterProfile
} from '../Controllers/recruiter.controller.js';

const recruiterRouter = express.Router();

// Get Recruiter ID by User ID
recruiterRouter.get('/getRecruiterId/:userId', getRecruiterIdByUserId);

// Get Recruiter Profile
recruiterRouter.get('/get-profile/:userId', getRecruiterProfile);

// Update Recruiter Profile
recruiterRouter.put('/update-profile/:userId', updateRecruiterProfile);

export default recruiterRouter;
