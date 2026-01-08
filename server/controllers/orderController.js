import User from "../models/user.js";
import Cart from "../models/cart.js";
import Coupan from "../models/coupan.js";
import Order from "../models/order.js";
import razorpay from "../config/razorpay.js";
import crypto from 'crypto';

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
    paymentMethod,
  } = req.body;
  if (!tableNumber) {
    const error = new Error("No table Found");
    error.status = 404;
    throw error;
  }
  try {
    let userId;
    if (req.user) {
      userId = req.user.id;
    }
    console.log(userId);
    const user = await User.findById(userId);
    console.log(user);
    const cartItems = await Cart.findOne({ userId }).populate(
      "items.menuItemId"
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
    //total Cart subtotal
    let subTotal = 0;
    for (let item of orderItems) {
      subTotal += item.subTotal;
    }
    console.log(subTotal);
    //NOTE calculate discount amount and cross verfiy the coupan
    const coupan = await Coupan.findOne({ code: coupanCode, isActive: true });

    let discountAmount = 0;
    if (coupan) {
      if (coupan.discountType === 'percentage') {
        discountAmount = (subTotal * coupan.discountValue) / 100;
        if (coupan.maxDiscount && discountAmount > coupan.maxDiscount) {
          discountAmount = coupan.maxDiscount;
        }
      } else if (coupan.discountType === 'fixedAmount') {
        discountAmount = coupan.discountValue;
      }
    }

    const discountedTotal = subTotal - discountAmount;
    const gst = Math.round(discountedTotal * 0.18);
    const finalAmount = discountedTotal + gst;

    const orderNumber = calculateOrderNumber();

    const dataOfOrder = {
      orderNumber,
      userId,
      sessionToken: null,
      items: orderItems,
      subTotal,
      discountAmount,
      finalAmount,
      coupanCode,
      tableNumber,
      customerEmail,
      customerName,
      paymentMethod,
      customerPhone,
      notes,
    };

    if (paymentMethod === "cash") {
      const order = await Order.create(dataOfOrder);
      return res.status(201).json({
        message: "Order Placed Successfully",
        data: order,
      });
    }

    if (paymentMethod === "razorpay") {
      console.log("this is runnnnnnnnnnnnnnnning");
      const options = {
        amount: finalAmount * 100,
        currency: "INR",
        receipt: orderNumber,
        notes: {
          customerEmail,
          customerPhone,
          customerName,
        },
      };
      const razorpayOrder = await razorpay.orders.create(options);
      console.log(razorpayOrder);
      dataOfOrder.razorPayOrderId = razorpayOrder.id;
      const order = await Order.create(dataOfOrder);
      return res.json({
        order,
        razorPayOrder: { ...razorpayOrder, key: process.env.RAZORPAY_API_KEY },
      });
    }

    user.totalOrders += 1;
    await user.save();

    res.json({ cartItems, orderItems, coupan });
  } catch (error) {
    next(error);
  }
};

//NOTE  client => client data X cross verify

//user identity customer/guest => if customer i need a id / if guest i need session

//NOTE userid => find cart using userId :
// var => cartItem
// items: [
//   {
//     menuItemId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Menu',
//     },
//     name: {
//       type: String,
//     },
//     price: {
//       type: Number,
//     },
//     quantity: {
//       type: Number,
//     },
//     subTotal: {
//       type: Number,
//       required: true,
//     },
//   },
// ],

//coupan
//discountAmout

//gst wagera totalAmount
//tableNumber
//coupan count
//razorpay
//customer update
//clear cart

// myorder => shirt , jeans => shirt => 2 => 500
// shirt + jeans => subtotal

export const verifyPayment = async (req, res, next) => {
  try {
    const { paymentId, signature, razorPayOrderId } = req.body;
    const order = await Order.findOne({ razorPayOrderId });
    if (!order) {
      const error = new Error("order not found");
      throw error;
    }
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(razorPayOrderId + "|" + paymentId)
      .digest("hex");

    if (generated_signature !== signature) {
      res
        .status(400)
        .json({ success: false, message: "Payment verification failed!" });
    }

    const payment = await razorpay.payments.fetch(paymentId);
    console.log(payment);

    if (payment.status === "captured" || payment.status === "authorized") {
      order.paymentStatus = "confirmed";
      order.razorPaySignature = signature;
      order.razorPayPaymentId = paymentId;
      await order.save();

      // Clear the cart after successful payment
      const cart = await Cart.findOne({ userId: order.userId });
      if (cart) {
        cart.items = [];
        cart.totalCartPrice = 0;
        await cart.save();
      }
    } else if (payment.status === "failed") {
      order.paymentStatus = "failed";
      await order.save();
    }
    res.status(200).json({
      success: true,
      message: "Payment Verified",
    });
  } catch (error) {
    next(error);
  }
};
