import express from 'express';
// import multer from 'multer';
// import path from 'path';
import { loginUser, logoutUser, refreshAccessToken, registerUser } from '../controllers/user.controller.js';
import upload from "../middlewares/multer.middleware.js"
import { verifyJWT } from '../middlewares/auth.middleware.js';
const  router = express.Router();
// const upload = multer({
//   storage: multer.diskStorage({
//     destination: (req, file, cb) => {
//       const uploadPath = path.join(process.cwd(), 'upload');
//       cb(null, uploadPath);
//     },
//     filename: (req, file, cb) => {
//       cb(null, `${file.originalname}`);
//     }
//   })
// });

router.post('/register', upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 }
]),registerUser );


router.route("/login").post(loginUser);

// secured rutes
router.route("/logout").post(verifyJWT ,logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
export default router;