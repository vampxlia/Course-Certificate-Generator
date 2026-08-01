// my_code
import express from 'express';
import { authorize } from "../middlewares/authorize";
import { getGeneratePage, handleEmailSubmit, handleGenerateSubmit } from "../controllers/certificates";
import { authenticate } from "../middlewares/authenticate";
export const router = express.Router();

router.get('/generate', authenticate, authorize, getGeneratePage);
router.post('/generate', authenticate, authorize, handleGenerateSubmit);
router.post('/email', authenticate, authorize, handleEmailSubmit);
