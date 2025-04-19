import mongoose, { Schema } from "mongoose";

// For hashing passwords 
import bcrypt from "bcrypt";

//  For generating JWT access and refresh tokens
import jwt from "jsonwebtoken";

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    cnic: {
        type: String,
        required: true,
        unique: true,
        minlength: 13,
        maxlength: 13,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    userType: {
        type: String,
        required: true,
        enum: ['Jobseeker', 'Recruiter', 'Admin'], // Assuming these are the user types
    },
    refreshToken: {
        type: String,
    },

    // * Job Seeker Specific Fields 
    resume: { type: String },
    skills: [{ type: String }],
    experienceLevel: { type: String },
    //  TODO 
    // appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
    preferredLocations: [{ type: String }],
    jobInterests: [{ type: String }],

    // * Recruiter Specific Fields
    companyName: { type: String },
    companyLogo: { type: String },
    // TODO
    // postedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
    designation: { type: String },
    contactNumber: { type: String },

}, { timestamps: true });

// Before saving user we will check if password is modified
userSchema.pre('save', async function (next) {
    if (!this.isModified("password"))
        return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        role: this.role,
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }

    )
}

// We use little payload in Refresh token as compared to the Access token as it refreshes more frequently
userSchema.methods.generateRefreshTokens = function () {
    return jwt.sign({
        _id: this._id,
    },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    )
}

// This method will verify the Password of the user
userSchema.methods.isPasswordCorrect = async function (pass) {
    return await bcrypt.compare(pass, this.password);
}

export const User = mongoose.model("User", userSchema);