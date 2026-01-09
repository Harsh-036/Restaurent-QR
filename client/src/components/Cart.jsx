import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Trash2, Plus, Minus, ShoppingBag, ChevronDown, ChevronUp } from "lucide-react";
import { getCart, increaseItemQuantity, decreaseItemQuantity, removeItem, increaseQuantityOptimistic, decreaseQuantityOptimistic, removeItemOptimistic, placeOrder, verifyPayment } from "../redux/cartSlice";
import { getCoupons } from "../redux/couponSlice";
import { getUser } from "../redux/authSlice";
import socketService from "../lib/socket";
import toast from "react-hot-toast";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector((state) => state.cart);
  const { coupons, loading: couponLoading } = useSelector((state) => state.coupon);
  const { user } = useSelector((state) => state.auth);

  const [showCoupons, setShowCoupons] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [customerDetails, setCustomerDetails] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    tableNumber: 1,
    notes: ''
  });


  const cartItems = cart?.items || [];

  const totalPrice = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + item.quantity * item.menuItemId.price,
        0
      ),
    [cartItems]
  );

  const discountedTotal = useMemo(() => {
    if (appliedCoupon && appliedCoupon.discountAmount) {
      return totalPrice - appliedCoupon.discountAmount;
    }
    return totalPrice;
  }, [totalPrice, appliedCoupon]);

  // TODO: Implement updateQuantity and removeItem with server calls

  // Fetch cart data on component mount
  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  const userRole = localStorage.getItem('userRole');

  // Fetch coupons when totalPrice changes (only for logged-in users)
  useEffect(() => {
    if (totalPrice > 0 && userRole !== 'guest') {
      dispatch(getCoupons(totalPrice));
    }
  }, [totalPrice, dispatch, userRole]);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // Fetch user data on component mount for logged-in users
  useEffect(() => {
    if (userRole !== 'guest') {
      dispatch(getUser());
    }
  }, [dispatch, userRole]);

  // Update customer details when user data is available
  useEffect(() => {
    if (user) {
      setCustomerDetails(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  // WebSocket connection and event listeners for coupons
  useEffect(() => {
    socketService.connect();

    // Listen for coupon events to refresh coupons
    socketService.onCouponCreated(() => {
      if (totalPrice > 0 && userRole !== 'guest') {
        dispatch(getCoupons(totalPrice));
      }
    });

    socketService.onCouponUpdated(() => {
      if (totalPrice > 0 && userRole !== 'guest') {
        dispatch(getCoupons(totalPrice));
      }
    });

    socketService.onCouponDeleted(() => {
      if (totalPrice > 0 && userRole !== 'guest') {
        dispatch(getCoupons(totalPrice));
      }
    });

    // Cleanup on unmount
    return () => {
      socketService.off('coupon:created');
      socketService.off('coupon:updated');
      socketService.off('coupon:deleted');
    };
  }, [dispatch, totalPrice, userRole]);

  const handlePlaceOrder = async () => {
    if (!customerDetails.name || !customerDetails.email || !customerDetails.phone) {
      toast.error("Please fill in all required details.");
      return;
    }

    const payload = {
      coupanCode: appliedCoupon?.code || '',
      tableNumber: customerDetails.tableNumber,
      customerEmail: customerDetails.email,
      customerName: customerDetails.name,
      customerPhone: customerDetails.phone,
      notes: customerDetails.notes,
      paymentMethod: 'razorpay',
    };

    try {
      const result = await dispatch(placeOrder(payload)).unwrap();
      console.log(result);

      const options = {
        key: result.razorPayOrder.key,
        amount: result.razorPayOrder.amount,
        order_id: result.order.razorPayOrderId,
        currency: "INR",
        name: "Restaurant QR",
        description: "Test Transaction",
        handler: async function (response) {
          console.log(response);
          toast.success(`Payment ID: ${response.razorpay_payment_id}`);
          const verifyResult = await dispatch(verifyPayment({
            paymentId: response.razorpay_payment_id,
            razorPayOrderId: response.razorpay_order_id,
            signature: response.razorpay_signature
          })).unwrap();
          if (verifyResult.success) {
            toast.success("Order successful!");
            navigate('/orders'); // Navigate to orders page or success page
          }
        },
        prefill: {
          name: customerDetails.name,
          email: customerDetails.email,
          contact: customerDetails.phone
        },
        theme: {
          color: "#1e2939"
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error(error);
      toast.error("Failed to place order. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[65vh] flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12 text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Loading your cart...
        </h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[65vh] flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12 text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Error loading cart
        </h2>
        <p className="text-gray-300 mb-6">
          {error}
        </p>
        <button
          onClick={() => dispatch(getCart())}
          className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!cartItems.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0e1a35] via-[#162544] to-[#0e1a35] flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12 text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Your cart feels lonely 😔
        </h2>
        <p className="text-gray-300 mb-6">
          Add some delicious food to continue
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          Explore Menu
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e1a35] via-[#162544] to-[#0e1a35] pt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Your Cart</h1>
        <p className="text-gray-300 mt-1">
          {cartItems.length} item(s) selected
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-5">
          {cartItems.map((item) => (
            <div
              key={item.menuItemId._id || item._id}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden hover:border-blue-500 transition"
            >
              <div className="flex flex-col sm:flex-row">
                <img
                  src={item.menuItemId?.image || '/placeholder-image.jpg'}
                  alt={item.menuItemId?.name || 'Menu Item'}
                  className="w-full sm:w-44 h-44 object-cover"
                />

                <div className="flex-1 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-white">
                        {item.menuItemId?.name || 'Unknown Item'}
                      </h3>
                      <span className="text-white font-bold">
                        ₹{item.menuItemId?.price || 0}
                      </span>
                    </div>

                    <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                      {item.menuItemId?.description || 'No description available'}
                    </p>

                    <span className="inline-block text-[11px] uppercase tracking-wider text-gray-300 border border-white/20 px-3 py-1 rounded-full">
                      {item.menuItemId?.category || 'N/A'}
                    </span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                    {/* Quantity */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center bg-secondary border border-border rounded-lg">
                        <button
                          onClick={() =>
                            dispatch(decreaseItemQuantity({ menuItemId: item.menuItemId._id }))
                          }
                          className="p-2 hover:bg-secondary/80 rounded-l-lg"
                        >
                          <Minus className="w-4 h-4 text-secondary-foreground" />
                        </button>
                        <span className="px-4 text-secondary-foreground font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => {
                            dispatch(increaseQuantityOptimistic({ menuItemId: item.menuItemId._id }));
                            dispatch(increaseItemQuantity({ menuItemId: item.menuItemId._id }));
                          }}
                          className="p-2 hover:bg-secondary/80 rounded-r-lg"
                        >
                          <Plus className="w-4 h-4 text-secondary-foreground" />
                        </button>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">Subtotal</p>
                        <p className="text-white font-semibold">
                          ₹{item.quantity * (item.menuItemId?.price || 0)}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        dispatch(removeItemOptimistic({ menuItemId: item.menuItemId._id }));
                        dispatch(removeItem({ menuItemId: item.menuItemId._id }));
                      }}
                      className="p-2 text-destructive rounded-lg hover:bg-destructive/10 transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 h-fit sticky top-24">
          <h2 className="text-xl font-semibold text-white mb-6">
            Order Summary
          </h2>

          <div className="space-y-4 text-gray-300">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{totalPrice}</span>
            </div>
            {appliedCoupon && appliedCoupon.discountAmount > 0 && (
              <div className="flex justify-between text-green-400">
                <span>Discount ({appliedCoupon.code})</span>
                <span>-₹{appliedCoupon.discountAmount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>GST (18%)</span>
              <span>₹{Math.round(discountedTotal * 0.18)}</span>
            </div>
            <div className="border-t border-white/20 pt-4 flex justify-between text-white font-semibold">
              <span>Total</span>
              <span>
                ₹{discountedTotal + Math.round(discountedTotal * 0.18)}
              </span>
            </div>
          </div>

          {/* Coupons Section or Guest Message */}
          {userRole === 'guest' ? (
            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-blue-300 text-sm">
                Login and purchase your first order to get a discount!
              </p>
            </div>
          ) : (
            couponLoading ? (
              <div className="mt-4 text-gray-300">Loading coupons...</div>
            ) : (
              <div className="mt-4">
                <button
                  onClick={() => setShowCoupons(!showCoupons)}
                  className="flex items-center justify-between w-full text-left text-lg font-semibold text-white hover:text-gray-300 transition"
                >
                  <span>Available Coupons</span>
                  {showCoupons ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                {showCoupons && (
                  <div className="mt-2">
                    {coupons.length > 0 ? (
                      [...coupons].sort((a, b) => b.isAvailable - a.isAvailable).map((coupon) => (
                        <button
                          key={coupon._id || coupon.code}
                          onClick={() => setAppliedCoupon(coupon)}
                          disabled={!coupon.isAvailable}
                          type="button"
                          className={`w-full text-left p-2 border rounded mb-2 transition ${coupon.isAvailable ? 'opacity-100 border-green-500 hover:bg-green-500/10' : 'opacity-50 border-gray-500 cursor-not-allowed'}`}
                        >
                          <div className="font-semibold text-white">{coupon.code}</div>
                          <div className="text-sm text-gray-300">{coupon.description}</div>
                          {coupon.isAvailable && coupon.discountAmount > 0 && (
                            <div className="text-green-400">Save ₹{coupon.discountAmount}</div>
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="text-gray-300">No coupons available</div>
                    )}
                  </div>
                )}
              </div>
            )
          )}

          {userRole === 'guest' ? (
            <button
              onClick={() => navigate('/login', { state: { fromCart: true, showSignup: true } })}
              className="w-full mt-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Sign Up to Proceed to Checkout
            </button>
          ) : (
            <button
              onClick={handlePlaceOrder}
              className="w-full mt-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
            >
              Pay and Place Order
            </button>
          )}

          <button
            onClick={() => navigate("/")}
            className="w-full mt-3 py-3 border border-white/20 text-white rounded-xl hover:bg-white/10 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Cart;
