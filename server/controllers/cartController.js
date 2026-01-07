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
    const { menuItemId, quantity = 1 } = req.body;

    let cart;

    // 1️⃣ USER CART
    if (req.authType === 'user') {
      cart = await Cart.findOne({ userId: req.user._id });

      if (!cart) {
        cart = new Cart({
          userId: req.user._id,
          items: [],
          totalCartPrice: 0,
        });
      }
    }

    // 2️⃣ GUEST CART
    if (req.authType === 'guest') {
      cart = await Cart.findOne({ sessionId: req.session._id });

      if (!cart) {
        cart = new Cart({
          sessionId: req.session._id,
          items: [],
          totalCartPrice: 0,
        });
      }
    }

    // 3️⃣ Menu validation
    const menu = await Menu.findById(menuItemId);
    if (!menu) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    // 4️⃣ Add / update item
    const existingItem = cart.items.find(
      (item) => item.menuItemId.toString() === menuItemId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ menuItemId, quantity });
    }

    // 5️⃣ Recalculate price & save
    await updateTotalPrice(cart);
    await cart.save();

    res.status(201).json({
      message: 'Item added to cart successfully',
      cart,
      cartType: req.authType,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error while adding to cart',
      error: error.message,
    });
  }
};


// Remove item from cart
export const removeItemCart = async (req, res) => {
  try {
    const { menuItemId } = req.body;

    let cart;

    // 1️⃣ USER CART
    if (req.authType === 'user') {
      cart = await Cart.findOne({ userId: req.user._id });
    }

    // 2️⃣ GUEST CART
    if (req.authType === 'guest') {
      cart = await Cart.findOne({ sessionId: req.session._id });
    }

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(
      (item) => item.menuItemId.toString() !== menuItemId
    );

    await updateTotalPrice(cart);
    await cart.save();
    await cart.populate('items.menuItemId');
    res.status(200).json({ message: 'Item removed from cart', cart, cartType: req.authType });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Increase item quantity
export const increaseItemQuantity = async (req, res) => {
  try {
    const { menuItemId } = req.body;

    let cart;

    // 1️⃣ USER CART
    if (req.authType === 'user') {
      cart = await Cart.findOne({ userId: req.user._id });
    }

    // 2️⃣ GUEST CART
    if (req.authType === 'guest') {
      cart = await Cart.findOne({ sessionId: req.session._id });
    }

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.find((i) => i.menuItemId.toString() === menuItemId);
    if (!item) return res.status(404).json({ message: 'Item not in cart' });

    item.quantity += 1;

    await updateTotalPrice(cart);
    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate('items.menuItemId');
    res.status(200).json({ message: 'Item quantity increased', cart: populatedCart, cartType: req.authType });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Decrease item quantity
export const decreaseItemQuantity = async (req, res) => {
  try {
    const { menuItemId } = req.body;

    let cart;

    // 1️⃣ USER CART
    if (req.authType === 'user') {
      cart = await Cart.findOne({ userId: req.user._id });
    }

    // 2️⃣ GUEST CART
    if (req.authType === 'guest') {
      cart = await Cart.findOne({ sessionId: req.session._id });
    }

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
    await cart.populate('items.menuItemId');
    res.status(200).json({ message: 'Item quantity decreased', cart, cartType: req.authType });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get cart for authenticated user
export const getCart = async (req, res) => {
  try {
    let cart;

    // 1️⃣ USER CART
    if (req.authType === 'user') {
      cart = await Cart.findOne({ userId: req.user._id }).populate('items.menuItemId');
    }

    // 2️⃣ GUEST CART
    if (req.authType === 'guest') {
      cart = await Cart.findOne({ sessionId: req.session._id }).populate('items.menuItemId');
    }

    if (!cart) {
      return res.status(200).json({ cart: { items: [], totalCartPrice: 0 } });
    }

    res.status(200).json({ cart });
  } catch (error) {
    res.status(500).json({
      message: 'Server error while fetching cart',
      error: error.message,
    });
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

// Migrate guest cart to user cart
export const migrateCart = async (req, res) => {
  try {
    const { sessionId } = req.body;

    // Find guest cart
    const guestCart = await Cart.findOne({ sessionId });
    if (!guestCart || guestCart.items.length === 0) {
      return res.status(200).json({ message: 'No guest cart to migrate', cart: { items: [], totalCartPrice: 0 } });
    }

    // Find or create user cart
    let userCart = await Cart.findOne({ userId: req.user._id });
    if (!userCart) {
      userCart = new Cart({
        userId: req.user._id,
        items: [],
        totalCartPrice: 0,
      });
    }

    // Merge items
    guestCart.items.forEach(guestItem => {
      const existingItem = userCart.items.find(item => item.menuItemId.toString() === guestItem.menuItemId.toString());
      if (existingItem) {
        existingItem.quantity += guestItem.quantity;
      } else {
        userCart.items.push(guestItem);
      }
    });

    // Recalculate price
    await updateTotalPrice(userCart);
    await userCart.save();

    // Delete guest cart
    await Cart.deleteOne({ sessionId });

    const populatedCart = await Cart.findById(userCart._id).populate('items.menuItemId');
    res.status(200).json({ message: 'Cart migrated successfully', cart: populatedCart });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
