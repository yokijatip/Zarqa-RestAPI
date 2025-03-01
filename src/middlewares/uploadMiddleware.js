import multer, { diskStorage } from "multer";
import { extname } from "path";
import { v4 as uuidv4 } from "uuid";

// Konfigurasi penyimpanan File
const storage = diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    const ext = extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

// Middleware Multer
const upload = multer({ storage });

export default upload;
