import express from 'express';
import { body } from 'express-validator';
import { requireAuth } from '../middleware/auth.js';
import { askWellnessBot, getBotHistory } from '../controllers/botController.js';

const router = express.Router();
router.use(requireAuth);

router.post('/ask', [body('message').isString().isLength({ min: 1 })], askWellnessBot);
router.get('/history', getBotHistory);

export default router;


