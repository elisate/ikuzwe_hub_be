import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Setup Storage Engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    // @ts-ignore
    folder: 'community_app_avatars',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'gif'], // Added gif support for larger files
    // Removed the 500x500 transformation so you can keep the original size/quality 
    // of the larger 20MB uploads if you prefer.
  },
});

// 3. Initialize Multer with 20MB Limit
export const upload = multer({ 
  storage: storage,
  limits: { 
    fileSize: 20 * 1024 * 1024 // 20MB in bytes
  } 
});