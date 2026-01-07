import express from 'express' ;
import { createTable, getAllTables, getTableBySlug, updateTable, toggleTableStatus, deleteTable } from '../controllers/tableController.js';
import verifyToken from '../middleware/verifyToken.js';
import checkRole from '../middleware/checkRole.js';

const router = express.Router() ;

router.post('/tables',createTable )
router.get('/tables/:slug' , getTableBySlug)
router.get('/tables' , verifyToken , checkRole(['admin']), getAllTables)
router.put('/tables/:id', updateTable)
router.patch('/tables/:id/toggle', toggleTableStatus)
router.delete('/tables/:id', deleteTable)



export default router
