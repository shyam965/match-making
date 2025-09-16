import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads folder exists
const uploadPath = path.join("uploads/");
fs.mkdirSync(uploadPath, { recursive: true });

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // preserve file extension
  },
});

// File type filter
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "video/mp4",
    "video/mkv",
    "video/webm",
    "video/avi",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    // Pass a MulterError instead of generic Error for better handling
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
  }
};

// Multer instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 1024 }, // 1GB max per file
});

export default upload;
