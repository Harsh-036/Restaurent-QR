import express from 'express' ;
import { createMenu } from '../controllers/menuController.js';
// import verifyToken from '../middlewares/verifyToken';

import upload from '../middleware/upload.js';
const router = express.Router() ;

router.post('/menu' , upload.single('image') , createMenu)

export default router