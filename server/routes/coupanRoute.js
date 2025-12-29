import express from 'express';
import verifyToken from '../middleware/verifyToken.js'
import { getAllCoupans, registerCoupan } from '../controllers/coupanController.js';



const router = express.Router() ;

router.get('/coupans',verifyToken, getAllCoupans)

router.post('/coupans', registerCoupan)

export default router