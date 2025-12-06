import express from 'express';
import { session } from '../controllers/sessionController.js';
// import { session } from '../controllers/sessionController.js';

const router = express.Router() ;

router.post('/session', session)

export default router