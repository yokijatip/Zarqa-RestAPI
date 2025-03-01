const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// Konfigurasi penyimpanan File
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

// Middleware Multer
const upload = multer({ storage });

module.exports = upload;
