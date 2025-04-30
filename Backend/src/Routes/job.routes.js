// job.routes.js
import { Router } from "express";
import { postJob, getJobs,applyToJob,getUserDashboard, getPostedJobsByRecruiter, updateJob, deleteJob, getJobApplicants, updateApplicantStatus } from "../Controllers/jobs.controller.js"; 


const jobRouter = Router();

jobRouter.route('/postjob').post(postJob);

jobRouter.get("/get-jobs/:jobseekerId", getJobs);
jobRouter.put("/apply/:jobId", applyToJob);
jobRouter.get("/UserDashboard/:userId", getUserDashboard);
jobRouter.get("/get-posted-jobs/:recruiterId", getPostedJobsByRecruiter);
jobRouter.put("/updatejob/:id", updateJob);
jobRouter.delete("/deletejob/:id", deleteJob);
jobRouter.get("/applicants/:jobId", getJobApplicants);
jobRouter.put("/update-status/:jobId", updateApplicantStatus);



export default jobRouter;
