import express from 'express';
import {
  addToCart,
  removeItemCart,
  increaseItemQuantity,
  decreaseItemQuantity,
  clearCart,
  getCart,
  migrateCart
} from '../controllers/cartController.js';
import verifyAuthOrSession from '../middleware/verifyAuthOrSession.js';

const router = express.Router();

// Add item to cart
router.post('/addtocart', verifyAuthOrSession, addToCart);

// Get cart for authenticated user or guest
router.get('/getcart', verifyAuthOrSession, getCart);

// Remove specific item from cart
router.post('/removeitem', verifyAuthOrSession, removeItemCart);

// Increase item quantity
router.post('/increaseitem', verifyAuthOrSession, increaseItemQuantity);

// Decrease item quantity
router.post('/decreaseitem', verifyAuthOrSession, decreaseItemQuantity);

// Clear entire cart
router.post('/clearcart', verifyAuthOrSession, clearCart);

// Migrate guest cart to user cart
router.post('/migratecart', verifyAuthOrSession, migrateCart);

export default router;
