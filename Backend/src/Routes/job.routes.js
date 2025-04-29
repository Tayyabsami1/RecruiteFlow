// job.routes.js
import { Router } from "express";
import { postJob, getJobs,applyToJob,getUserDashboard } from "../Controllers/jobs.controller.js"; // Add your job controller
const jobRouter = Router();

jobRouter.route('/postjob').post(postJob);

jobRouter.get("/get-jobs/:jobseekerId", getJobs);
jobRouter.put("/apply/:jobId", applyToJob);
jobRouter.get("/UserDashboard/:userId", getUserDashboard);

export default jobRouter;
