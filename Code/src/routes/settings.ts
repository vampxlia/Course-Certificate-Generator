import express from "express";
import multer from "multer";
import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";
import {getSettingsPage, updateRepositorySettings, updateSignatureSettings} from "../controllers/settings";

export const router = express.Router();

// Store the .p12 file in memory so the controller can write it to the final location
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
    fileFilter: (_req, file, cb) => {
        const allowed = [".p12", ".pfx"];
        const ext = file.originalname.slice(file.originalname.lastIndexOf(".")).toLowerCase();
        if (allowed.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error("Apenas ficheiros .p12 ou .pfx são aceites."));
        }
    },
});

router.get("/settings",           authenticate, authorize, getSettingsPage);
router.post("/settings/signature", authenticate, authorize, upload.single("p12file"), updateSignatureSettings);
router.post("/settings/repo", authenticate, authorize, updateRepositorySettings)
//router.post("/settings/email",     authenticate, authorize, updateEmailSettings);
