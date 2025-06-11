import {User} from "../Models/user.model.js";  // adjust path if needed
import mongoose from "mongoose";
import { JobSeeker } from "../Models/jobseeker.model.js";


export const getJobSeekerProfile = async (req, res) => {
  try {
      const jobSeeker = await JobSeeker.findOne({ user: req.params.userId });
      if (!jobSeeker) {
          return res.status(404).json({ message: 'JobSeeker not found' });
      }
      res.json(jobSeeker);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

// Update JobSeeker Profile
export const updateJobSeekerProfile = async (req, res) => {
  try {
      const { skills, experienceLevel, preferredLocations, jobInterests } = req.body;
      const updatedData = {
          skills: JSON.parse(skills),
          experienceLevel,
          preferredLocations: JSON.parse(preferredLocations),
          jobInterests: JSON.parse(jobInterests),
      };

      if (req.file) {
          updatedData.resume = req.file.path;
      }

      const jobSeeker = await JobSeeker.findOneAndUpdate(
          { user: req.params.userId },
          { $set: updatedData },
          { new: true }
      );

      if (!jobSeeker) {
          return res.status(404).json({ message: 'JobSeeker not found' });
      }
      console.log(jobSeeker)
     return res.json(jobSeeker);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

export const getJobSeekerIdByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const jobSeeker = await JobSeeker.findOne({ user: userId });

    if (!jobSeeker) {
      return res.status(404).json({ message: "Job Seeker not found for this user." });
    }

    res.status(200).json({ jobSeekerId: jobSeeker._id });
  } catch (error) {
    console.error("Error fetching Job Seeker ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
