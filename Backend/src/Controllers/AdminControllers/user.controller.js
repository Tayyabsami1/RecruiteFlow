// So that we dont have to write the try-catch block in every route handler
import { asyncHandler } from "../../Utils/asyncHandler.js"

// To standardize the API Error responses
import { ApiError } from "../../Utils/apiError.js"

// To standardize the API Responses
import { ApiResponse } from "../../Utils/apiResponse.js"

import { User } from "../../Models/user.model.js"

export const GetAllUsers = asyncHandler(async (req, res) => {
    try {
        // Get all users without any filtering
        const users = await User.find()
            .select("-password -refreshToken") // Exclude sensitive data
            .sort({ createdAt: -1 }); // Sort by creation date, newest first

        if (!users || users.length === 0) {
            return res.status(404).json(
                new ApiResponse(404, {}, "No users found")
            );
        }

        // Return response
        return res.status(200).json(
            new ApiResponse(
                200,
                { users },
                "Users retrieved successfully"
            )
        );
    } catch (error) {
         return res.status(500).json(new ApiError(500, "Error retriving Users"));
        
    }
});

export const DeleteUser = asyncHandler(async(req, res) => {
    try {
        const { userId } = req.body;
        console.log(userId)

        if (!userId) {
            return res.status(400).json(
                new ApiError(400, "User ID is required")
            );
        }

        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json(
                new ApiError(404, "User not found")
            );
        }

        return res.status(200).json(
            new ApiResponse(
                200, 
                {}, 
                "User deleted successfully"
            )
        );
    } catch (error) {
        return res.status(500).json(
            new ApiError(500, "Error deleting user")
        );
    }
});

export const EditUser = asyncHandler(async(req, res) => {
    try {
        const { userId, name, email, cnic, phone, userType } = req.body;

        // Check if userId is provided
        if (!userId) {
            return res.status(400).json(
                new ApiError(400, "User ID is required")
            );
        }

        // Find the user by ID
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json(
                new ApiError(404, "User not found")
            );
        }

        // Update user fields if they are provided in the request
        if (name) user.name = name;
        if (email) user.email = email;
        if (cnic) user.cnic = cnic;
        if (phone) user.phone = phone;
        if (userType) user.userType = userType;

        // Save the updated user
        const updatedUser = await user.save();

        // Return the updated user without sensitive information
        const userWithoutSensitiveInfo = await User.findById(updatedUser._id)
            .select("-password -refreshToken");

        return res.status(200).json(
            new ApiResponse(
                200,
                { user: userWithoutSensitiveInfo },
                "User updated successfully"
            )
        );
    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json(
            new ApiError(500, "Error updating user")
        );
    }
});
