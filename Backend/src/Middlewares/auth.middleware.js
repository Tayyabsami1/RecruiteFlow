import { ApiError } from "../Utils/apiError.js";
import { asyncHandler } from "../Utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../Models/user.model.js";

// Our custom middleware
export const verifyJWT=asyncHandler(async(req,_,next)=>{
    // Step 1 take our access token that we generated while login and its logic is written in the user.model.js
    // we will take the token from the cookies as we have the access because of the cookie-parser
   const token= req.cookies?.accessToken|| req.header("Authorization")?.replace("Bearer ","")

   // If we didnt get the code from the cookies this means user is not logged in 
   if(!token) throw new ApiError(401,"Unauthorized Request");

   // lets verify the token with our jwt 
   const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);

   // Take the ID from our DB and remove the password and refresh token from it 
   const user=await User.findById(decodedToken._id).select("-password -refreshToken");

   // At this point if we dont have the user then our Invalid Token is incorrect 
   if(!user)
    throw new ApiError(401,"Invalid Access Token");

   // If we have correct user then we append it to the request 
   req.user=user;
   next();

});