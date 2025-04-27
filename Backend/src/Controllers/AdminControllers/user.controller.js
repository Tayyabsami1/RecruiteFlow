// Sp that we dont have to write the try-catch block in every route handler
import { asyncHandler } from "../../Utils/asyncHandler.js"

// To standardize the API Error responses
import { ApiError } from "../../Utils/apiError.js"

// To standardize the API Responses
import { ApiResponse } from "../../Utils/apiResponse.js"

import { User } from "../../Models/user.model.js"

export const GetAllUsers = asyncHandler(async (req, res) => {

})

