import Cart from '../models/cart.js'
import Coupan from '../models/coupan.js'

const calculateOrderNumber = () => {
  const date = Date.now();
  const randomNumber = Math.floor(Math.random() * 10000000);
  return `ORDER-${date * randomNumber}`;
};

export const createOrder = async (req, res, next) => {
  const {
    coupanCode,
    tableNumber,
    customerName,
    customerEmail,
    customerPhone,
    notes,
    paymentMode,
  } = req.body;
  if (!tableNumber) {
    const error = new Error('No table Found');
    error.status = 404;
    throw error;
  }

  try {
    let userId;
    if (req.user) {
      userId = req.user.id;
    }
    console.log(userId);
    const cartItems = await Cart.findOne({ userId }).populate(
      'items.menuItemId'
    );
    const orderItems = [];
 
    for (let item of cartItems.items) {
      let subTotal = 0;
      console.log(item);
      console.log(item.quantity, item.menuItemId.price);
      const total = item.quantity * item.menuItemId.price;
      subTotal += total;
 
      orderItems.push({
        menuItemId: item.menuItemId._id,
        name: item.menuItemId.name,
        price: item.menuItemId.price,
        quantity: item.quantity,
        subTotal,
      });
    }

    //total cart subtotal
    let subTotal = 0;
    for(let item of orderItems) {
      subTotal += item.subTotal;
    }
      console.log(subTotal)


    //calculate discount amount and cross verify the coupan
    const coupan = await Coupan.findOne({code : coupanCode, isActive: true})

    //result discountAmount?
    const orderNumber = calculateOrderNumber();

    const dataOfOrder = {
      orderNumber,
      userId,
      sessionToken: sessionToken || null,
      items: orderItems,
      subTotal,
      coupanCode,
      tableNumber,
      customerEmail,
      customerName,
      customerPhone,
      notes,
    };
 
    res.json({ cartItems, orderItems, coupan });
  } catch (error) {
    next(error);
  }
};