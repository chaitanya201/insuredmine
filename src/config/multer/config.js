import multer from "multer";
import path from "path";
import fs from "fs";
import { SERVER_CONFIG } from "../server.config.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), SERVER_CONFIG.POLICY_FILE_PATH);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

export const uploadPolicyFileMiddleware = upload.single("policyFile");
