// Sp that we dont have to write the try-catch block in every route handler
import { asyncHandler } from "../Utils/asyncHandler.js"

// To standardize the API Error responses
import { ApiError } from "../Utils/apiError.js"

// To standardize the API Responses
import { ApiResponse } from "../Utils/apiResponse.js"

// User Model 
import { User } from "../Models/user.model.js"
import jwt from "jsonwebtoken";


// Utility Function to generate access and refresh tokens with the help of methods we made in User Model
const generateAccessAndRefreshToken = async (userID) => {
    try {
        const user = await User.findById(userID);
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshTokens()

        user.refreshToken = refreshToken;
        // We update the data in the db
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    }
    catch (err) {
        throw new ApiError(500, "Something went wrong while generating your tokens")
    }
}


export const LoginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Please fill in all the credentials");
    }

    const MyUser = await User.findOne({ email });

    if (!MyUser) throw new ApiError(400, "User doesnot exist");

    const isPassValid = await MyUser.isPasswordCorrect(password);

    if (!isPassValid) throw new ApiError(401, "Password is Incorrect");

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(MyUser._id);

    const LoggedInUser = await User.findById(MyUser._id).select("-password -refreshToken");

    // Cookies Options 
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
    }

    // Sending Response and setting Cookies

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { LoggedInUser, accessToken, refreshToken }, "User Logged In Successfully"));
});

// TODO (Modify it according to Our Need)
export const SignUpUser = asyncHandler(async (req, res) => {
    const { name, cnic, phone, email, password, userType} = req.body;
    const role = "user";

    if (!email || !password || !name || !cnic || !phone || !userType) {
        throw new ApiError(400, "Please fill in all the credentials");
    }

    // We made on a query on the user model in the database , if user or email exist or not
    const UserExist = await User.findOne({
        $or: [{ name }, { email }]
    });

    // If user exists we simply throw the Error
    if (UserExist) throw new ApiError(409, "This User already exists");

    const MyNewUser = await User.create({
        name: name.toLowerCase(),
        password,
        email,
        cnic,
        phone,
        userType,
        role,
    });

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(MyNewUser._id);

    const createdUser = await User.findById(MyNewUser._id).select("-password -refreshToken");

    if (!createdUser) throw new ApiError(500, "Something went wrong while creating the User");

    // Cookies Options 
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, {createdUser,refreshToken,accessToken}, "User registered successfully"));

});

export const LogoutUser = asyncHandler(async (req, res) => {
    // Update the DB Remove the refreshToken from the user document
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1,
            }
        }, {
        new: true,
    }
    )

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
        .status(200)
        .clearCookie("refreshToken", options)
        .clearCookie("accessToken", options)
        .json(new ApiResponse(200, {}, "User Logged out"));
});

export const AuthorizationCheck = asyncHandler(async (req, res) => {
    const token= req.cookies?.accessToken|| req.header("Authorization")?.replace("Bearer ","");

     // If we didnt get the code from the cookies this means user is not logged in 
   if(!token) throw new ApiError(401,"Unauthorized Request");

   // lets verify the token with our jwt 
   const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);

   // Take the ID from our DB and remove the password and refresh token from it 
   const user=await User.findById(decodedToken._id).select("-password -refreshToken");

   // At this point if we dont have the user then our Invalid Token is incorrect 
   if(!user)
    throw new ApiError(401,"Invalid Access Token");

   return res.status(200).json(new ApiResponse(200, user,"User is Authorized"));
})