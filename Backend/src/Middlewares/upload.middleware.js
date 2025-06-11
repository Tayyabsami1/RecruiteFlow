import multer from 'multer';
import path from 'path';

// Storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/resumes'); // Directory to save uploaded resumes
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Rename the file
    }
});

// File Filter
const fileFilter = (req, file, cb) => {
    const allowedFileTypes = /pdf/;
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
        cb(null, true);
    } else {
        cb('Error: Resume must be a PDF file!');
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

export default upload;
