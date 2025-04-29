import mongoose, { Schema } from "mongoose";

const recruiterSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    companyName: { type: String },
    companyLogo: { type: String },
    designation: { type: String },
    contactNumber: { type: String },
   // postedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }]
}, { timestamps: true });

export const Recruiter = mongoose.model('Recruiter', recruiterSchema);
