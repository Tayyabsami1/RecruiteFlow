import {User} from "../Models/user.model.js";  // adjust path if needed
import mongoose from "mongoose";
import { JobSeeker } from "../Models/jobseeker.model.js";

export const completeJobSeekerProfile = async (req, res) => {
    try {
        const { skills, experienceLevel, preferredLocations, jobInterests } = req.body;
        const userId = req.params.userId; // passed from URL

        const resumePath = req.file ? req.file.path : null;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid User ID" });
          }
      
          // Step 1: Find the User
          const user = await User.findById(userId).populate("jobSeekerProfile");
      
          if (!user) {
            return res.status(404).json({ message: "User not found" });
          }
      
          // Step 2: Find the JobSeeker document (by user field)
          let jobSeeker = await JobSeeker.findOne({ user: userId });
      
          if (!jobSeeker) {
            return res.status(404).json({ message: "JobSeeker profile not found" });
          }
      

          if (skills) jobSeeker.skills = skills;
          if (experienceLevel) jobSeeker.experienceLevel = experienceLevel;
          if (preferredLocations) jobSeeker.preferredLocations = preferredLocations;
          if (jobInterests) jobSeeker.jobInterests = jobInterests;
           if (resumePath) {
            jobSeeker.resume = resumePath;
           }

         // Step 4: Save the updated document
    await jobSeeker.save();

    return res.status(200).json({ message: "Profile updated successfully", jobSeeker });
    } catch (error) {
    console.error("Error updating JobSeeker profile:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
