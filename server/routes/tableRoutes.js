import express from 'express' ;
import { createTable } from '../controllers/tableController.js';

const router = express.Router() ;

router.post('/tables',createTable )


export default router
