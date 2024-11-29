import mongoose, { Schema } from "mongoose";

/**
 * User Schema for the MediaConnect platform.
 * This schema represents the user data model, including authentication information,
 * user details, media history, and role-based access control (RBAC).
 * 
 * Fields:
 * - username: A unique, lowercase string used for login.
 * - email: A unique string for the user's email.
 * - fullName: The user's full name.
 * - avatar: URL of the user's avatar image (stored on Cloudinary).
 * - coverImage: URL of the user's cover image (stored on Cloudinary).
 * - watchHistory: An array of references to watched videos.
 * - password: The user's password (hashed for security).
 * - refreshToken: The token used for refreshing sessions.
 * - role: Defines the user's role (admin, moderator, user, guest) for RBAC.
 * 
 * Timestamps are automatically added for each document.
 */

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, // cloudinary URL
      required: true,
    },
    coverImage: {
      type: String, // cloudinary URL
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
    // Adding role field for RBAC, now includes 'guest'
    role: {
      type: String,
      enum: ["admin", "moderator", "user"], // Define the roles
      default: "user", // Default role is 'guest'
    },
  },
  {
    timestamps: true,
  }
);


export const User = mongoose.model("User", userSchema);
