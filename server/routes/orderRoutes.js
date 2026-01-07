import express from 'express';
import { createOrder, verifyPayment } from '../controllers/orderController.js';
import checkGuestOrUser from '../middleware/checkGuestAndUser.js';
const router = express.Router();

router.post('/orders', checkGuestOrUser, createOrder);
router.post('/verify/payment' , verifyPayment)


export default router;