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

