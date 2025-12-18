import express from 'express';
import {
  addToCart,
  removeItemCart,
  increaseItemQuantity,
  decreaseItemQuantity,
  clearCart,
  getCart
} from '../controllers/cartController.js';
import verifyAuth from '../middleware/verifyAuth.js'

const router = express.Router();

// Add item to cart
router.post('/addtocart', verifyAuth, addToCart);

// Get cart for authenticated user
router.get('/getcart', verifyAuth, getCart);

// Remove specific item from cart
router.post('/removeitem', verifyAuth, removeItemCart);

// Increase item quantity
router.post('/increaseitem', verifyAuth, increaseItemQuantity);

// Decrease item quantity
router.post('/decreaseitem', verifyAuth, decreaseItemQuantity);

// Clear entire cart
router.post('/clearcart', clearCart);

export default router;
