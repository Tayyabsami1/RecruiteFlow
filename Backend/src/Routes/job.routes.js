// job.routes.js
import { Router } from "express";
import { postJob, getJobs,applyToJob,getUserDashboard, getPostedJobsByRecruiter } from "../Controllers/jobs.controller.js"; // Add your job controller
const jobRouter = Router();

jobRouter.route('/postjob').post(postJob);

jobRouter.get("/get-jobs/:jobseekerId", getJobs);
jobRouter.put("/apply/:jobId", applyToJob);
jobRouter.get("/UserDashboard/:userId", getUserDashboard);
jobRouter.get("/get-posted-jobs/:recruiterId", getPostedJobsByRecruiter);


export default jobRouter;
