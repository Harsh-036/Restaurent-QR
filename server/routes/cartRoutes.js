import express from 'express' ;
import { addToCart } from '../controllers/cartController.js';

const router = express.Router() ;


router.post('/addtocart', addToCart)

export default router