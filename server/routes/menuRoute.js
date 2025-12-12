import express from 'express';
import { 
  createMenu, 
  getMenu, 
  updateMenu, 
  deleteMenu, 
  toggleAvailability,
//   updateAvailability
} from '../controllers/menuController.js';

import upload from '../middleware/upload.js';

const router = express.Router();

// CREATE
router.post('/menu', upload.single('image'), createMenu);

// GET (with optional category filter)
router.get('/menu', getMenu);

// UPDATE
router.put('/menu/:id', upload.single('image'), updateMenu);

// DELETE
router.delete('/menu/:id', deleteMenu);

router.patch('/menu/:id/availability', toggleAvailability);
// router.put('/menu/:id/availability', updateAvailability);


export default router;
