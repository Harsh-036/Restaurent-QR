import express from 'express';
import {
  addToCart,
  removeItemCart,
  increaseItemQuantity,
  decreaseItemQuantity,
  clearCart
} from '../controllers/cartController.js';

const router = express.Router();

// Add item to cart
router.post('/addtocart', addToCart);

// Remove specific item from cart
router.post('/removeitem', removeItemCart);

// Increase item quantity
router.post('/increaseitem', increaseItemQuantity);

// Decrease item quantity
router.post('/decreaseitem', decreaseItemQuantity);

// Clear entire cart
router.post('/clearcart', clearCart);

export default router;
