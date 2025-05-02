// So that we dont have to write the try-catch block in every route handler
import { asyncHandler } from "../../Utils/asyncHandler.js"

// To standardize the API Error responses
import { ApiError } from "../../Utils/apiError.js"

// To standardize the API Responses
import { ApiResponse } from "../../Utils/apiResponse.js"

// Import models to count documents
import { User } from "../../Models/user.model.js"
import { JobSeeker } from "../../Models/jobseeker.model.js"
import { Recruiter } from "../../Models/recruiter.model.js"
import { Job } from "../../Models/job.model.js"

export const GetDashboardStats = asyncHandler(async (req, res) => {
    try {
        // Count total jobs
        const totalJobs = await Job.countDocuments();
        
        // Count total recruiters
        const totalRecruiters = await Recruiter.countDocuments();
        
        // Count total job seekers
        const totalJobSeekers = await JobSeeker.countDocuments();
        
        // Return response
        return res.status(200).json(
            new ApiResponse(
                200,
                { totalJobs, totalRecruiters, totalJobSeekers },
                "Dashboard statistics retrieved successfully"
            )
        );
    } catch (error) {
        return res.status(500).json(
            new ApiError(500, "Error retrieving dashboard statistics: " + error.message)
        );
    }
});