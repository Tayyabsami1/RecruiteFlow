import { Recruiter } from "../Models/recruiter.model.js";
import multer from "multer";
import path from "path";

// File upload configuration (e.g. storing in public folder)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/companyLogos"); // adjust as per your folder
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

export const upload = multer({ storage: storage });

// ──────────── CONTROLLERS ─────────────

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

// Update Recruiter Profile (with file upload support)
export const updateRecruiterProfile = async (req, res) => {
  try {
    const { companyName, designation, contactNumber } = req.body;

    const updatedData = {
      ...(companyName && { companyName }),
      ...(designation && { designation }),
      ...(contactNumber && { contactNumber }),
      ...(req.file && { companyLogo: `uploads/companyLogos/${req.file.filename}` }),
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
