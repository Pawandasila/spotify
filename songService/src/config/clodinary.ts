import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { Env } from './env.config.js';

cloudinary.config({
  cloud_name: Env.CLOUDINARY_CLOUD_NAME,
  api_key: Env.CLOUDINARY_API_KEY,
  api_secret: Env.CLOUDINARY_API_SECRET,
  secure: true,
  // Enhanced timeout configuration to handle EPROTO errors
  upload_timeout: 120000, // 2 minutes
  timeout: 120000,
});

const storage = multer.memoryStorage();

// Upload configuration for album thumbnails (images)
export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB for images
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
           cb(new Error('Not an image! Please upload only images.'));
        }
    }
}).single('thumbnail');


export const uploadAudio = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('audio/') || 
            file.mimetype === 'application/octet-stream' ||
            file.originalname.match(/\.(mp3|wav|flac|aac|ogg|m4a)$/i)) {
            cb(null, true);
        } else {
           cb(new Error('Not an audio file! Please upload only audio files.'));
        }
    }
}).single('audio');

// Upload configuration for songs with both thumbnail and audio
export const uploadSongWithThumbnail = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB max for any single file
    },
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'thumbnail') {
            // Check if it's an image file
            if (file.mimetype.startsWith('image/')) {
                cb(null, true);
            } else {
                cb(new Error('Thumbnail must be an image file!'));
            }
        } else if (file.fieldname === 'audio') {
            // Check if it's an audio file
            if (file.mimetype.startsWith('audio/') || 
                file.mimetype === 'application/octet-stream' ||
                file.originalname.match(/\.(mp3|wav|flac|aac|ogg|m4a)$/i)) {
                cb(null, true);
            } else {
                cb(new Error('Audio must be an audio file!'));
            }
        } else {
            cb(new Error('Unexpected field! Only thumbnail and audio are allowed.'));
        }
    }
}).fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'audio', maxCount: 1 }
]);

export default cloudinary;
