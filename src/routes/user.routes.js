import express from 'express';
import { 
  uploadVideo, 
  changeCurrentPassword, 
  getCurrentUser, 
  getUserChannelProfile, 
  loginUser, 
  logoutUser, 
  refreshAccessToken, 
  registerUser, 
  subscribeToChannel, 
  unsubscribeFromChannel, 
  updateAccountDetails, 
  updateAvatar, 
  updateCoverImage 
} from '../controllers/user.controller.js';
import upload from "../middlewares/multer.middleware.js";
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * Public Routes:
 * These routes do not require authentication or role-based access.
 */

// User registration - open to all users
router.post('/register', upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 }
]), registerUser );

// User login - open to all users
router.route("/login").post(loginUser);

/**
 * Secured Routes:
 * These routes require JWT authentication, and some also require specific roles (Admin, Moderator).
 */

// Logout - Authenticated users can log out
router.route("/logout").post(verifyJWT(['admin', 'moderator', 'user']), logoutUser);

// Refresh token - No role check required (usually just needs authentication)
router.route("/refresh-token").post(refreshAccessToken);

// Change password - Authenticated users can change their password
router.route("/change-password").post(verifyJWT(['admin', 'moderator', 'user']), changeCurrentPassword);

/**
 * Admin Routes:
 * These routes are protected and accessible only by admins.
 */

// Admin Dashboard - Only accessible by Admin
router.route("/admin-dashboard").get(verifyJWT(['admin']), (req, res) => {
  res.json({ message: 'Welcome to the Admin Dashboard!' });
});

/**
 * Moderator Routes:
 * These routes are protected and accessible by both Admins and Moderators.
 */

// Moderator Dashboard - Accessible by Admins and Moderators
router.route("/moderator-dashboard").get(verifyJWT(['admin', 'moderator']), (req, res) => {
  res.json({ message: 'Welcome to the Moderator Dashboard!' });
});

/**
 * User Routes:
 * These routes are for managing user-related data and actions.
 * They are protected and accessible by Admins, Moderators, and Users.
 */

// Current User - Get information about the current logged-in user
router.route("/current-user").get(verifyJWT(['admin', 'moderator', 'user']), getCurrentUser);

// Update Account Details - Authenticated users can update their account details
router.route("/update-account").patch(verifyJWT(['admin', 'moderator', 'user']), updateAccountDetails);

// Update Avatar - Authenticated users can update their avatar
router.route("/update-avatar").patch(verifyJWT(['admin', 'moderator', 'user']), upload.single("avatar"), updateAvatar);

// Update Cover Image - Authenticated users can update their cover image
router.route("/update-cover-image").patch(verifyJWT(['admin', 'moderator', 'user']), upload.single("coverImage"), updateCoverImage);

/**
 * Channel Routes:
 * These routes allow users to interact with channels (view, subscribe, unsubscribe).
 */

// Get Channel Profile - Any authenticated user can view a channel profile
router.route("/channel/:username").get(verifyJWT(['admin', 'moderator', 'user']), getUserChannelProfile);

// Subscribe to a Channel - Any authenticated user can subscribe to a channel
router.route("/channels/:username/subscribe").post(verifyJWT(['admin', 'moderator', 'user']), subscribeToChannel);

// Unsubscribe from a Channel - Any authenticated user can unsubscribe from a channel
router.route("/channels/:username/unsubscribe").post(verifyJWT(['admin', 'moderator', 'user']), unsubscribeFromChannel);

/**
 * Video Routes:
 * These routes allow users to upload and manage videos.
 */

// Upload Video - Any authenticated user can upload a video
router.route("/upload-video").post(verifyJWT(['admin', 'moderator', 'user']), upload.single("videoFile"), uploadVideo);

export default router;
