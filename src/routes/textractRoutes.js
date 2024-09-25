import express from 'express';
import { uploadImageAndExtractText } from '../controllers/textractController.js';

const router = express.Router();

router.post('/extract-text', uploadImageAndExtractText);

export default router;
