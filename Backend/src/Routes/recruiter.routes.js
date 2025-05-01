import express from 'express';
import {
  getRecruiterIdByUserId,
  getRecruiterProfile,
  updateRecruiterProfile
} from '../Controllers/recruiter.controller.js';
import uploadRecruiterLogo from '../Middlewares/uploadRecruiterLogo.middleware.js';

const recruiterRouter = express.Router();

// Get Recruiter ID by User ID
recruiterRouter.get('/getRecruiterId/:userId', getRecruiterIdByUserId);

// Get Recruiter Profile
recruiterRouter.get('/get-profile/:userId', getRecruiterProfile);

// Update Recruiter Profile with file upload
recruiterRouter.put('/update-profile/:userId', uploadRecruiterLogo.single('companyLogo'), updateRecruiterProfile);




export default recruiterRouter;
