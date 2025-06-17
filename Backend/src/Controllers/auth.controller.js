// Sp that we dont have to write the try-catch block in every route handler
import { asyncHandler } from "../Utils/asyncHandler.js"

// To standardize the API Error responses
import { ApiError } from "../Utils/apiError.js"

// To standardize the API Responses
import { ApiResponse } from "../Utils/apiResponse.js"

// User Model 
import { User } from "../Models/user.model.js"
import { JobSeeker } from "../Models/jobseeker.model.js"
import { Recruiter } from "../Models/recruiter.model.js"
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
        return new ApiError(500, "Something went wrong while generating your tokens");
    }
}

export const LoginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json(new ApiError(400, "Please fill in all the credentials"));
    }

    const MyUser = await User.findOne({ email });

    if (!MyUser) return res.status(409).json(new ApiError(400, "User doesnot exist"))

    const isPassValid = await MyUser.isPasswordCorrect(password);

    if (!isPassValid) return res.status(409).json(new ApiError(401, "Password is Incorrect"))

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

export const SignUpUser = asyncHandler(async (req, res) => {
    const { name, cnic, phone, email, password, userType } = req.body;

    if (!email || !password || !name || !cnic || !phone || !userType) {
        throw new ApiError(400, "Please fill in all the credentials");
    }

    // We made on a query on the user model in the database , if user or email exist or not
    const UserExist = await User.findOne({
        $or: [{ name }, { email }]
    });

    // If user exists we simply throw the Error
    if (UserExist) return res.status(409).json(new ApiError(409, "This User already exists"))

    let MyNewUser;
    try {
        MyNewUser = await User.create({
            name: name.toLowerCase(),
            password,
            email,
            cnic,
            phone,
            userType,
        });
    }
    catch (err) {
        console.log(err)
        return res.status(409).json(new ApiError(500, "The Email, CNIC or Phone Number is already registered"));
    }

    if (MyNewUser.userType === 'Jobseeker') {
        const jobSeekerProfile = await JobSeeker.create({ user: MyNewUser._id });
        MyNewUser.jobSeekerProfile = jobSeekerProfile._id;
    } 
    else if (MyNewUser.userType === 'Recruiter') {
        const recruiterProfile = await Recruiter.create({ user: MyNewUser._id });
        MyNewUser.recruiterProfile = recruiterProfile._id;
    }

    await MyNewUser.save({validateBeforeSave:false}); // Now the reference is stored

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(MyNewUser._id);

    const createdUser = await User.findById(MyNewUser._id).select("-password -refreshToken");

    if (!createdUser) return res.status(500).json(new ApiError(500, "Something went wrong while creating the User"));

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
        .json(new ApiResponse(200, { createdUser, refreshToken, accessToken }, "User registered successfully"));

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
        sameSite: 'None',
    }

    return res
        .status(200)
        .clearCookie("refreshToken", options)
        .clearCookie("accessToken", options)
        .json(new ApiResponse(200, {}, "User Logged out"));
});

export const AuthorizationCheck = asyncHandler(async (req, res) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    // If we didnt get the code from the cookies this means user is not logged in 
    if (!token) return res.status(401).json(new ApiError(401, "Unauthorized Request"));

    // lets verify the token with our jwt 

    let user;
    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        // Take the ID from our DB and remove the password and refresh token from it 
        user = await User.findById(decodedToken._id).select("-password -refreshToken");
    }
    catch (err) {
        return res.status(401).json(new ApiError(401, "Your Session has expired, please login again"));
    }


    

    // At this point if we dont have the user then our Invalid Token is incorrect 
    if (!user)
        return res.status(401).json(new ApiError(401, "Invalid Access Token"));

    return res.status(200).json(new ApiResponse(200, user, "User is Authorized"));
})