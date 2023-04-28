import express from 'express';
import multer from 'multer';

import { uploadController } from '../controllers/uploadController';
import { downloadController } from '../controllers/downloadController';

const router = express.Router();

const upload = multer({ dest: 'uploads/' });
router.post("/upload", upload.single('csvFile'), uploadController);
router.get('/download', downloadController);

export default router;