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
        ref: 'User',
    }],
    shortlisted: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    interviewed: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],

    // Recruiter who posted the job
    // whoPosted: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Recruiter',
    //     required: true,
    // },
   
    // Status of the job
    status: {
        type: String,
        enum: ['open', 'closed'],
        default: 'open',
    }
}, { timestamps: true });

export const Job = mongoose.model('Job', jobSchema);
export default Job;
