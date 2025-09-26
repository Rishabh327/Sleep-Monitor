import express from 'express';
import { body, param } from 'express-validator';
import { requireAuth } from '../middleware/auth.js';
import { createSleepLog, getSleepLogs, updateSleepLog, deleteSleepLog } from '../controllers/sleepLogController.js';

const router = express.Router();

router.use(requireAuth);

router.post(
  '/',
  [
    body('sleepStart').isISO8601().toDate(),
    body('sleepEnd').isISO8601().toDate(),
    body('mood').optional().isIn(['very_bad', 'bad', 'neutral', 'good', 'very_good']),
    body('caffeine').optional().isFloat({ min: 0 }),
    body('disturbances').optional().isInt({ min: 0 }),
    body('notes').optional().isString(),
  ],
  createSleepLog
);

router.get('/', getSleepLogs);

router.put(
  '/:id',
  [
    param('id').isMongoId(),
    body('sleepStart').optional().isISO8601().toDate(),
    body('sleepEnd').optional().isISO8601().toDate(),
    body('mood').optional().isIn(['very_bad', 'bad', 'neutral', 'good', 'very_good']),
    body('caffeine').optional().isFloat({ min: 0 }),
    body('disturbances').optional().isInt({ min: 0 }),
    body('notes').optional().isString(),
  ],
  updateSleepLog
);

router.delete('/:id', [param('id').isMongoId()], deleteSleepLog);

export default router;


