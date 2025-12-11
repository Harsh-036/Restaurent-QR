import Cart from '../models/cart.js';
import Menu from '../models/menu.js';

// Helper function to update totalCartPrice
const updateTotalPrice = async (cart) => {
  let total = 0;
  for (const item of cart.items) {
    const menu = await Menu.findById(item.menuItemId);
    if (menu) {
      total += item.quantity * menu.price;
    }
  }
  cart.totalCartPrice = total;
};

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { menuItemId, userId, quantity = 1 } = req.body;

    let cart = await Cart.findOne({ userId });
    if (!cart) cart = new Cart({ userId, items: [], totalCartPrice: 0 });

    let menu = await Menu.findById(menuItemId);
    if (!menu) return res.status(404).json({ message: 'Menu item not found' });

    const existingMenuItem = cart.items.find(
      (item) => item.menuItemId.toString() === menuItemId
    );

    if (!existingMenuItem) {
      cart.items.push({ menuItemId, quantity });
    } else {
      existingMenuItem.quantity += quantity;
    }

    await updateTotalPrice(cart);
    await cart.save();
    res.status(201).json({ message: 'Items added to cart', cart });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Remove item from cart
export const removeItemCart = async (req, res) => {
  try {
    const { userId, menuItemId } = req.body;
    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(
      (item) => item.menuItemId.toString() !== menuItemId
    );

    await updateTotalPrice(cart);
    await cart.save();
    res.status(200).json({ message: 'Item removed from cart', cart });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Increase item quantity
export const increaseItemQuantity = async (req, res) => {
  try {
    const { userId, menuItemId } = req.body;
    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.find((i) => i.menuItemId.toString() === menuItemId);
    if (!item) return res.status(404).json({ message: 'Item not in cart' });

    item.quantity += 1;

    await updateTotalPrice(cart);
    await cart.save();
    res.status(200).json({ message: 'Item quantity increased', cart });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Decrease item quantity
export const decreaseItemQuantity = async (req, res) => {
  try {
    const { userId, menuItemId } = req.body;
    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.find((i) => i.menuItemId.toString() === menuItemId);
    if (!item) return res.status(404).json({ message: 'Item not in cart' });

    item.quantity -= 1;
    if (item.quantity <= 0) {
      cart.items = cart.items.filter(
        (i) => i.menuItemId.toString() !== menuItemId
      );
    }

    await updateTotalPrice(cart);
    await cart.save();
    res.status(200).json({ message: 'Item quantity decreased', cart });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    const { userId } = req.body;
    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = [];
    cart.totalCartPrice = 0;

    await cart.save();
    res.status(200).json({ message: 'Cart cleared', cart });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
