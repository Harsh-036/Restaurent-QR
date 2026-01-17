import express from 'express';
import { createOrder, verifyPayment, getAllOrders, getUserOrders, updateOrderStatus } from '../controllers/orderController.js';
import verifyAuthOrSession from '../middleware/verifyAuthOrSession.js';
import checkRole from '../middleware/checkRole.js';
import verifyToken from '../middleware/verifyToken.js';
const router = express.Router();

router.post('/orders', verifyAuthOrSession, createOrder);
router.post('/verify/payment' , verifyPayment);
router.get('/orders', verifyToken, checkRole(['admin']), getAllOrders);
router.get('/myorders', verifyToken, getUserOrders);
router.patch('/orders/:id/status', verifyToken, checkRole(['admin']), updateOrderStatus);


export default router;
