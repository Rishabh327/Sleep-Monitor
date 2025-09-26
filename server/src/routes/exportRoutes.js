import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { exportCsv, exportPdf } from '../controllers/exportController.js';

const router = express.Router();
router.use(requireAuth);
router.get('/csv', exportCsv);
router.get('/pdf', exportPdf);

export default router;


