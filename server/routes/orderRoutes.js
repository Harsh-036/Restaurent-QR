import express from 'express';
import { createOrder } from '../controllers/orderController.js';
import checkGuestOrUser from '../middleware/checkGuestAndUser.js';
const router = express.Router();

router.post('/orders', checkGuestOrUser, createOrder);

export default router;