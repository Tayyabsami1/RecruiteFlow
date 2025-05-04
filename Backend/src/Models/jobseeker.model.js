import mongoose, { Schema } from "mongoose";

const jobSeekerSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    resume: { type: String },
    skills: [{ type: String }],
    experienceLevel: { type: String },
    preferredLocations: [{ type: String }],
    jobInterests: [{ type: String }],
  },
  { timestamps: true }
);

export const JobSeeker = mongoose.model("JobSeeker", jobSeekerSchema);
