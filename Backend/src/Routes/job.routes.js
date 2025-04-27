// job.routes.js
import { Router } from "express";
import { postJob, getAllJobs,applyToJob,unapplyFromJob } from "../Controllers/jobs.controller.js"; // Add your job controller
const jobRouter = Router();

jobRouter.route('/postjob').post(postJob);

jobRouter.get("/all", getAllJobs);
jobRouter.put("/apply/:jobId", applyToJob);
jobRouter.put("/unapply/:jobId", unapplyFromJob);

export default jobRouter;
