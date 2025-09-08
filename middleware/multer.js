
import multer from "multer";
import path from "path";
import fs from "fs";


const uploadPath = path.join("uploads/");
fs.mkdirSync(uploadPath, { recursive: true });


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

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
        cb(new Error("Only JPEG, PNG, JPG images and MP4, MKV, WEBM, AVI videos are allowed"));
    }
};


const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 1024 },
});

export default upload;
