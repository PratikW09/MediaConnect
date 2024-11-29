# MediaConnect - Video Streaming Backend

## 📖 Introduction
MediaConnect is a backend platform for a video streaming application designed to provide users with a seamless experience when uploading, streaming, and interacting with video content. It enables features like adaptive streaming, user subscriptions, and video likes while ensuring high performance, scalability, and security.

---

## 🔧 Features
- **Video Uploads**:  
  Users can upload videos, and the platform automatically adjusts the resolution for optimal playback (1080p, 720p, 480p).
  
- **HLS Streaming**:  
  Adaptive bitrate streaming is used to ensure smooth playback by dynamically adjusting the video quality based on the viewer's internet speed.
  
- **Subscriptions**:  
  Users can subscribe to other content creators to stay updated with their latest videos and uploads (non-monetized).
  
- **Likes**:  
  Viewers can like videos they enjoy, allowing content creators to track the popularity of their content.
  
- **Secure Authentication**:  
  Google OAuth and OTP-based verification ensure a secure authentication process for users.

---

## 🔧 Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Video Processing & Storage**: Multer, Cloudinary, HLS
- **Authentication**: Google OAuth, OTP verification
- **Other Tools**: Docker, Git, Postman

---

## 🚀 Setup

### 1. Clone the Repository
```bash
git clone https://github.com/PratikW09/MediaConnect.git
cd MediaConnect
npm run dev
```
---
Your backend will now be running at http://localhost:5000.

## 🏆 Achievements
- Optimized Video Streaming: Reduced video bandwidth usage by 40% through the use of HLS streaming, improving overall performance.
- Fast Video Processing: Enabled resolution-based video conversion within 2-3 seconds using Cloudinary for faster processing and scaling.
- Efficient Data Handling: Indexed subscription data in MongoDB for fast query performance, even with large datasets.
- Secure User Authentication: Implemented Google OAuth and OTP-based authentication to provide a secure experience for users.

---
## 🧪 Testing Credentials
### Admin User:
- Email: admin@gmail.com
- Password: 12345
### Moderator User
- Email: moderator@gamil.com
- Password: 12345
---
## 📞 Contact
If you would like to collaborate, report issues, or contribute to the project, feel free to reach out to me:

- **Email**: walalepratik09@gmail.com
- **LinkedIn**: Pratik Walale
- **GitHub**: PratikW09
- **LeetCode**: Pratik_09jain
- **CodeChef**: pratik09_w
