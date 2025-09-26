import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getAnalysis } from '../controllers/analysisController.js';

const router = express.Router();
router.use(requireAuth);
router.get('/', getAnalysis);

export default router;


