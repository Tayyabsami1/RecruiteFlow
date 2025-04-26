// job.routes.js
import { Router } from "express";
import { postJob } from "../Controllers/jobs.controller.js"; // Add your job controller
const jobRouter = Router();

jobRouter.route('/postjob').post(postJob);

export default jobRouter;
