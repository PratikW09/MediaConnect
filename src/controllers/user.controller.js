import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from '../utils/FileUpload.js';
import {ApiRespose} from "../utils/ApiResponse.js"

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
    console.log(req.files);
    const avatarLocalPath =  req.files?.avatar[0]?.path;
    const coverImageLocalPath =  req.files?.coverImage[0]?.path;
    console.log(avatarLocalPath);

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
        password,
        avatar : avatar.url,
        coverImage :coverImage?.url || "" ,
         
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiRespose(200,createdUser,"User Created Succesfully")
    )


})  

export {registerUser};

