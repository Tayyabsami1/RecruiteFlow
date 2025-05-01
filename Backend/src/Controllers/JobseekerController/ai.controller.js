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