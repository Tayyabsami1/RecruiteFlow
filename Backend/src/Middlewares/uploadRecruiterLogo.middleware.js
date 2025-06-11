import multer from 'multer';
import path from 'path';
import { uploadOnCloudinary } from '../Utils/Cloudinary.js';
// Ensure upload directory exists
const uploadDir = 'uploads/companyLogos';
// Storage engine to store files locally 
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadDir);
//   },
//   filename: function (req, file, cb) {
//     const uniqueName = Date.now() + path.extname(file.originalname);
//     cb(null, uniqueName);
//   }
// });
// ! Will be used in serverless environments
const storage=multer.memoryStorage()


// // Create storage engine that sends directly to Cloudinary
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'recruiteflow/companyLogos', // organize uploads in a folder
//     allowed_formats: ['jpg', 'jpeg', 'png'],
//     transformation: [{ width: 500, height: 500, crop: 'limit' }], // resize if needed
//     public_id: (req, file) => {
//       const uniqueName = `${Date.now()}-${file.originalname.split('.')[0]}`;
//       return uniqueName;
//     }
//   }
// });

// File filter for image types
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only .jpeg, .jpg and .png image formats are allowed!'));
  }
};

// Multer upload instance with Cloudinary storage
const multerUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // limit file size to 2MB
  }
});

// Create a middleware that handles the upload to Cloudinary after multer processes the file
const uploadRecruiterLogo = {
  single: (fieldName) => {
    return [
      multerUpload.single(fieldName),
      async (req, res, next) => {
        try {
          if (!req.file) {
            return next();
          }

          // Convert buffer to data URL for uploadOnCloudinary
          const dataUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
          
          // Upload to Cloudinary using the utility function
          const result = await uploadOnCloudinary(dataUrl);
          
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
            throw new Error("Failed to upload image to Cloudinary");
          }
        } catch (error) {
          next(error);
        }
      }
    ];
  }
};

export default uploadRecruiterLogo;
