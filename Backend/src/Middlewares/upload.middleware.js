import multer from 'multer';
import path from 'path';
import { uploadOnCloudinary } from '../Utils/Cloudinary.js';

// Use memory storage for serverless environments like Vercel
const storage = multer.memoryStorage();

// File Filter
const fileFilter = (req, file, cb) => {
    const allowedFileTypes = /pdf/;
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
        cb(null, true);
    } else {
        cb(new Error('Error: Resume must be a PDF file!'));
    }
};

// Multer upload instance with memory storage
const multerUpload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // limit to 5MB
    }
});


// Create a middleware that handles the upload to Cloudinary after multer processes the file
const upload = {
    single: (fieldName) => {
        return [
            multerUpload.single(fieldName),
            async (req, res, next) => {
                try {
                    if (!req.file) {
                        return next();
                    }                    // For PDF files, we need to specify the resource_type as 'raw' 
                    // Convert buffer to data URL for uploadOnCloudinary
                    const dataUrl = `data:application/pdf;base64,${req.file.buffer.toString('base64')}`;
                    
                    // Upload to Cloudinary in the resumes folder with specific PDF options
                    const result = await uploadOnCloudinary(dataUrl, "recruiteflow/resumes");
                    
                    if (result) {
                        // Replace the file object with Cloudinary result
                        req.file = {
                            ...req.file,
                            path: result.url,
                            cloudinaryId: result.public_id,
                            secureUrl: result.secure_url
                        };
                        next();
                    } else {
                        throw new Error("Failed to upload resume to Cloudinary");
                    }
                } catch (error) {
                    next(error);
                }
            }
        ];
    }
};

export default upload;
