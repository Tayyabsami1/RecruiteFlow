import { Router } from "express";
import { GetAllJobs, UpdateJob, DeleteJob } from "../../Controllers/AdminControllers/jobs.controller.js";
import { verifyJWT } from "../../Middlewares/auth.middleware.js";

const adminJobsRouter = Router();

// Route to get all jobs in the system (Admin only)
adminJobsRouter.get("/", verifyJWT, GetAllJobs);

// Route to update a job by ID (Admin only)
adminJobsRouter.put("/updatejob", verifyJWT, UpdateJob);

// Route to delete a job by ID (Admin only)
adminJobsRouter.delete("/deletejob", verifyJWT, DeleteJob);

export default adminJobsRouter;