import express from 'express' ;
import { createMenu, getMenu } from '../controllers/menuController.js';
// import verifyToken from '../middlewares/verifyToken';

import upload from '../middleware/upload.js';
const router = express.Router() ;

router.post('/menu' , upload.single('image') , createMenu)

// Fetch all menu items
router.get('/menu', getMenu);

export default router