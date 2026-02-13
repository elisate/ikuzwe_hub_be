"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_1 = require("cloudinary");
// 1. Configure Cloudinary
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
// 2. Setup Storage Engine
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: {
        // @ts-ignore
        folder: 'community_app_avatars',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'gif'], // Added gif support for larger files
        // Removed the 500x500 transformation so you can keep the original size/quality 
        // of the larger 20MB uploads if you prefer.
    },
});
// 3. Initialize Multer with 20MB Limit
exports.upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 20 * 1024 * 1024 // 20MB in bytes
    }
});
