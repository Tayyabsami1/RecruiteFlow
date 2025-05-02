// So that we dont have to write the try-catch block in every route handler
import { asyncHandler } from "../../Utils/asyncHandler.js"

// To standardize the API Error responses
import { ApiError } from "../../Utils/apiError.js"

// To standardize the API Responses
import { ApiResponse } from "../../Utils/apiResponse.js"

import { User } from "../../Models/user.model.js"
import { Job} from "../../Models/job.model.js"

export const GetAllJobs = asyncHandler(async(req, res) => {
    try {
        // Fetch all jobs with populated references for recruiter and applicant details
        const jobs = await Job.find()
            .populate({
                path: "whoPosted",
                model: "Recruiter",
                populate: {
                    path: "user",
                    model: "User",
                    select: "name email"
                }
            })
            .populate({
                path: "whoApplied",
                model: "JobSeeker",
                populate: {
                    path: "user",
                    model: "User",
                    select: "name email"
                }
            })
            .sort({ createdAt: -1 }); // Sort by creation date, newest first

        if (!jobs || jobs.length === 0) {
            return res.status(404).json(
                new ApiResponse(404, {}, "No jobs found")
            );
        }

        // Return the jobs data
        return res.status(200).json(
            new ApiResponse(
                200,
                { jobs },
                "All jobs retrieved successfully"
            )
        );
    } catch (error) {
        console.error("Error retrieving jobs:", error);
        return res.status(500).json(
            new ApiError(500, "Error retrieving jobs")
        );
    }
});

// Update job by ID (Admin)
export const UpdateJob = asyncHandler(async(req, res) => {
    try {
        const {jobId} = req.body;
        const { title, location, experienceLevel, skills, industry, status } = req.body;

        // Check if job exists
        const existingJob = await Job.findById(jobId);
        if (!existingJob) {
            return res.status(404).json(
                new ApiError(404, "Job not found")
            );
        }

        // Update job fields
        const updatedFields = {
            ...(title && { title }),
            ...(location && { location }),
            ...(experienceLevel && { experienceLevel }),
            ...(skills && { skills }),
            ...(industry && { industry }),
            ...(status && { status }),
        };

        const updatedJob = await Job.findByIdAndUpdate(
            jobId,
            { $set: updatedFields },
            { new: true }
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                { job: updatedJob },
                "Job updated successfully"
            )
        );
    } catch (error) {
        console.error("Error updating job:", error);
        return res.status(500).json(
            new ApiError(500, "Error updating job")
        );
    }
});

// Delete job by ID (Admin)
export const DeleteJob = asyncHandler(async(req, res) => {
    try {
        const {jobId} = req.body;

        // Check if job exists
        const existingJob = await Job.findById(jobId);
        if (!existingJob) {
            return res.status(404).json(
                new ApiError(404, "Job not found")
            );
        }

        // Delete the job
        await Job.findByIdAndDelete(jobId);

        return res.status(200).json(
            new ApiResponse(
                200,
                {},
                "Job deleted successfully"
            )
        );
    } catch (error) {
        console.error("Error deleting job:", error);
        return res.status(500).json(
            new ApiError(500, "Error deleting job")
        );
    }
});