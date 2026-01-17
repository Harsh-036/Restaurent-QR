import express from 'express';
import { getDashboardData } from '../controllers/dashboardController.js';
import verifyToken from '../middleware/verifyToken.js';
import checkRole from '../middleware/checkRole.js';

const router = express.Router();

router.get('/dashboard', verifyToken, checkRole(['admin']), getDashboardData);

export default router;
