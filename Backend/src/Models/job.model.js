import mongoose, { Schema } from "mongoose";

const jobSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    experienceLevel: {
        type: String,
        required: true,
    },
    skills: [{
        type: String,
        required: true,
    }],
    industry: {
        type: String,
        required: true,
    },

    // Applicant status tracking (referencing Users)
    whoApplied: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JobSeeker',
    }],
    shortlisted: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JobSeeker',
    }],
    interviewed: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JobSeeker',
    }],

    // Recruiter who posted the job
    whoPosted: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recruiter',
        required: true,
    },
   
    // Status of the job
    status: {
        type: String,
        enum: ['open', 'closed'],
        default: 'open',
    },
    // For Future purposes dont remove 
    // hired: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    // }],
    // rejected: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    // }],
}, { timestamps: true });

export const Job = mongoose.model('Job', jobSchema);
