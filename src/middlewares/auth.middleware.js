import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

/**
 * Middleware to verify JWT and check user role for RBAC.
 * This ensures that the user is authenticated and has the required role to access the route.
 *
 * @param {Array} roles - The array of roles allowed to access the route.
 */
export const verifyJWT = (roles = []) => asyncHandler(async (req, res, next) => {
    try {
        // Get token from the request headers or cookies
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        // If no token is found, return Unauthorized
        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        // Verify JWT token
        const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Find the user from the decoded token's _id and exclude sensitive fields like password and refreshToken
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        // If no user is found, return Invalid Access Token error
        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }

        // Attach the user object to the request for further use
        req.user = user;

        // If roles are provided, check if the user's role matches one of the allowed roles
        if (roles.length && !roles.includes(user.role)) {
            throw new ApiError(403, "Forbidden: You don't have permission to access this resource.");
        }

        // Proceed to the next middleware if everything is valid
        next();

    } catch (error) {
        // Catch and throw error if JWT verification or role check fails
        throw new ApiError(400, error?.message || "Invalid Access Token");
    }
});
