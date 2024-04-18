import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from '../utils/FileUpload.js';
import {ApiRespose} from "../utils/ApiResponse.js"
import bcrypt from "bcrypt"
import { generateAccessToken, genrateRefreshToken } from '../utils/genrateToken.js';

const generateAccessAndRefreshToken = async(userId)=>{
    try {
        const user = await User.findById(userId);
        // console.log(user)
        const accessToken =  generateAccessToken(user);
        const refreshToken =  genrateRefreshToken(user);
        // console.log(accessToken);
        // console.log(refreshToken);
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave:false});

        return {accessToken,refreshToken};
    } catch (error) {
        throw new ApiError(500,"something went wrong while genrating access and refresh token");
    }

}


const registerUser = asyncHandler( async (req,res) => {
    /*
    -> get user detail from frontnd
    -> validation -not empty, email proper
    -> check if user already exist by username and email
    -> check for images and check for avtar
    -> upload them to cloudinary
    -> create user object- enter in the database
    -> check for user creation
    -> return the user
    */

    const {fullName, email, username, password}= req.body;

    if(
        [fullName,username,email,password].some( (field) => {
            field?.trim()==="";
        })
    ){
        throw new ApiError(400,"All fileds are required");
    }

    const existedUser = await User.findOne({
        $or: [{email},{username}]
    })

    if(existedUser){
        throw new ApiError(409,"User with email or username already exits");
    }
    // console.log(req.files);

    const hashPassword = await bcrypt.hash(password,10);
    const avatarLocalPath =  req.files?.avatar[0]?.path;
    // const coverImageLocalPath =  req.files?.coverImage[0]?.path;
    // console.log(avatarLocalPath);


    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length >0){
        coverImageLocalPath = req.files.coverImage[0].path;
    }
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if(!avatar){
        throw new ApiError(400,"avtar file is required from cluidnary");

    }
    

    const user = await User.create({
        fullName,
        username:username.toLowerCase(),
        email,
        password:hashPassword,
        avatar : avatar.url,
        coverImage :coverImage?.url || "" ,
        
         
    })
    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user")
    }
    // const option ={
    //     httpOnly:true,
    //     secure:true
    // }
    return res.status(201)
    // .cookie("accessToken",accessToken,option)
    // .cookie("refreshToken",refreshToken,option)
    .json(
        new ApiRespose(200,
            {
                user : createdUser,accessToken,refreshToken
            },"User Created Succesfully")
    )


}) 



const loginUser = asyncHandler(async (req,res)=>{
    // get the data from req.body
    // check using uername and email find the user in db
    // check the password
    // genrate the access and refresh token 
    // send with cokkie and response

    const {username,email,password} = req.body;
    // if(!username || !email){
    //     throw new ApiError(400,"username or email is required");
    // }

    if(!(username || email)){
        throw new ApiError(400,"username or email is required")
    }
    const user = await User.findOne({
        $or : [{username},{email}]
    })

    if(!user){
        throw new ApiError(404,"User does not exit first register kindly");
    }
    // console.log(password);
    // console.log(user.password)

    // const isPasswordValid = await user.isPasswordCorrect(password);
    const isPasswordValid = await bcrypt.compare(password,user.password);
    // console.log(isPasswordValid)

    if(!isPasswordValid){
        throw new ApiError(401,"Invaild user crendinital");
    }

    // genrating access and refresh token and saving it to data base
    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();
    const loginedUser = await User.findById(user._id).select("--password -refreshToken");

    const option ={
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,option)
    .cookie("refreshToken",refreshToken,option)
    .json(
        new ApiRespose(
            200,
            {
                user : loginedUser,accessToken,refreshToken
            },
            "User Logined Succesfully"
        )
    )

})


const logoutUser = asyncHandler(async(req,res)=>{
    console.log(req.user);
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken:undefined
            }
        },
        {
            new : true
        }
    )

    const option ={
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(
        new ApiRespose(200,{},"User Logout Successfully")
    )
})


const refreshAccessToken = asyncHandler( async(req,res)=>{
    try {
        const incomingRefreshToken = req.cookies.refreshToken||
        req.body.refreshToken
    
        if(! incomingRefreshToken){
            throw new ApiError(401, "Unauthoried request ")
        }
    
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id);
    
        if(! user){
            throw new ApiError(421,"Invalid Refresh token")
        }
    
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, "Refresh Token is expired or used")
        }
    
        const option ={
            httpOnly:true,
            secure:true
        }
        
        const {accessToken,newRefreshToken} = await generateAccessAndRefreshToken(user?._id);
    
        return res
        .status(200)
        .cookie("accessToken",accessToken,option)
        .cookie("refreshToken",newRefreshToken,option)
        .json(
            new ApiRespose(
                200,
                {accessToken,refreshToken:newRefreshToken,option},
                "access token refresh"
            )
        )
    } catch (error) {
        throw new ApiError(401,error?.message|| "Invalid token")
    }
})






export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
};

