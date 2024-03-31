import express from 'express';
// import multer from 'multer';
// import path from 'path';
import { registerUser } from '../controllers/user.controller.js';
import upload from "../middlewares/multer.middleware.js"
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

export default router;