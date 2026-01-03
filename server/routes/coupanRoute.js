import express from 'express';
import verifyToken from '../middleware/verifyToken.js'
import { getAllCoupans, registerCoupan, updateCoupan, deleteCoupan } from '../controllers/coupanController.js';



const router = express.Router() ;

router.get('/coupans',verifyToken, getAllCoupans)

router.post('/coupans', registerCoupan)

router.put('/coupans/:id', updateCoupan)

router.delete('/coupans/:id', deleteCoupan)

export default router
