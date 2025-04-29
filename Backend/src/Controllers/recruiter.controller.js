import { User } from "../Models/user.model.js"; // Adjust the path if needed
import { Recruiter } from "../Models/recruiter.model.js";

// Get Recruiter Profile
export const getRecruiterProfile = async (req, res) => {
  try {
    const recruiter = await Recruiter.findOne({ user: req.params.userId });
    if (!recruiter) {
      return res.status(404).json({ message: "Recruiter not found" });
    }
    res.json(recruiter);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Recruiter Profile
export const updateRecruiterProfile = async (req, res) => {
  try {
    const { companyName, companyWebsite, designation, industry } = req.body;

    const updatedData = {
      ...(companyName && { companyName }),
      ...(companyWebsite && { companyWebsite }),
      ...(designation && { designation }),
      ...(industry && { industry }),
    };

    const recruiter = await Recruiter.findOneAndUpdate(
      { user: req.params.userId },
      { $set: updatedData },
      { new: true }
    );

    if (!recruiter) {
      return res.status(404).json({ message: "Recruiter not found" });
    }

    res.json(recruiter);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Recruiter ID by User ID
export const getRecruiterIdByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const recruiter = await Recruiter.findOne({ user: userId });

    if (!recruiter) {
      return res.status(404).json({ message: "Recruiter not found for this user." });
    }

    res.status(200).json({ recruiterId: recruiter._id });
  } catch (error) {
    console.error("Error fetching Recruiter ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
