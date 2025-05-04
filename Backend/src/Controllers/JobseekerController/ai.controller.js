// So that we dont have to write the try-catch block in every route handler
import { asyncHandler } from "../../Utils/asyncHandler.js"

// To standardize the API Error responses
import { ApiError } from "../../Utils/apiError.js"

// To standardize the API Responses
import { ApiResponse } from "../../Utils/apiResponse.js"

// Import models
import { User } from "../../Models/user.model.js"
import { JobSeeker } from "../../Models/jobseeker.model.js"

// Import modules for API requests and file handling
import axios from "axios"
import fs from "fs"
import path from "path"
import FormData from "form-data"
import { fileURLToPath } from "url"
import { Job } from "../../Models/job.model.js"

// Get the current module's directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const GetReumeSkills = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const userId=_id;

    if (!userId) {
        throw new ApiError(400, "User ID is required")
    }

    // Find the user by ID
    const user = await User.findById(userId)
    
    if (!user) {
        throw new ApiError(404, "User not found")
    }

    if (user.userType !== "Jobseeker") {
        throw new ApiError(403, "Only job seekers can extract resume skills")
    }

    // Find the jobseeker profile using the user's ID
    const jobSeeker = await JobSeeker.findOne({ user: userId })
    
    if (!jobSeeker) {
        throw new ApiError(404, "Job seeker profile not found")
    }

    if (!jobSeeker.resume) {
        throw new ApiError(400, "No resume found for this user")
    }

    // Construct the full path to the resume file
    const resumePath = path.resolve(jobSeeker.resume);
    // Check if the file exists
    if (!fs.existsSync(resumePath)) {
        throw new ApiError(404, "Resume file not found")
    }

    try {
        const formData = new FormData()
        
        formData.append('resume', fs.createReadStream(resumePath))

        // Send the resume to the Python Flask API
        const response = await axios.post(
            `${process.env.PYTHON_BACKEND}/api/extract-skills`, 
            formData,
            {
                headers: {
                    ...formData.getHeaders() // This will set the correct content-type with boundaries
                }
            }
        )

        const skills = response.data.skills || []

        if (skills.length > 0 && (!jobSeeker.skills || jobSeeker.skills.length === 0)) {
            await JobSeeker.findByIdAndUpdate(jobSeeker._id, { skills: skills })
        }

        return res.status(200).json(
            new ApiResponse(200, { skills }, "Resume skills extracted successfully")
        )
    } catch (error) {
        throw new ApiError(500, "Failed to extract skills from resume: " + (error.message || "Unknown error"))
    }
})

export const getRecommendedJobs = asyncHandler(async (req, res) => {
    const { jobSeekerId } = req.params;
    
    // Find the JobSeeker
    const jobSeeker = await JobSeeker.findById(jobSeekerId);
    if (!jobSeeker) {
        throw new ApiError(404, "JobSeeker not found");
    }

    // Get all active jobs and find jobs where this jobseeker has applied
    const activeJobs = await Job.find({ status: "open" });
    const appliedJobs = await Job.find({ 
        whoApplied: jobSeekerId,
        status: "open"
    });
    
    // Get IDs of jobs where user has already applied
    const appliedJobIds = appliedJobs.map(job => job._id.toString());

    // First, get jobs matching both preferred locations AND skills
    const recommendedJobs = activeJobs.filter(job => {
        // Skip if already applied
        if (appliedJobIds.includes(job._id.toString())) {
            return false;
        }

        // Check if job location matches any preferred location
        const locationMatch = jobSeeker.preferredLocations.some(
            loc => job.location.toLowerCase() === loc.toLowerCase()
        );

        // Check if any job skill matches jobseeker skills
        const skillsMatch = job.skills.some(
            jobSkill => jobSeeker.skills.some(
                seekerSkill => seekerSkill.toLowerCase() === jobSkill.toLowerCase()
            )
        );

        // Return true only if both conditions are met
        return locationMatch && skillsMatch;
    });

    // Extract unique skills from jobs where user has applied
    const appliedJobsSkills = [...new Set(
        appliedJobs.flatMap(job => job.skills.map(skill => skill.toLowerCase()))
    )];

    // Find similar jobs based on applied jobs' skills AND preferred locations
    const similarJobs = activeJobs.filter(job => {
        // Skip if already in recommended jobs or already applied
        if (recommendedJobs.some(rec => rec._id.toString() === job._id.toString()) ||
            appliedJobIds.includes(job._id.toString())) {
            return false;
        }

        // Check if job location matches any preferred location
        const locationMatch = jobSeeker.preferredLocations.some(
            loc => job.location.toLowerCase() === loc.toLowerCase()
        );

        // Check if any job skill matches with skills from applied jobs
        const skillsMatch = job.skills.some(
            jobSkill => appliedJobsSkills.includes(jobSkill.toLowerCase())
        );

        // Return true only if both conditions are met
        return locationMatch && skillsMatch;
    });

    // Combine both types of recommendations
    const allRecommendedJobs = [...recommendedJobs, ...similarJobs];

    return res.status(200).json(
            { jobs: allRecommendedJobs }, 
            "Jobs recommended successfully"
        )
});