import React from 'react';
import api from '../lib/api';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
function Checkout() {

  const cart = useSelector((state) => state.cart.cart);
  const user = useSelector((state) => state.auth.user);

  // Calculate total amount from cart items
  const totalAmount = cart?.items?.reduce((total, item) => {
    return total + (item.quantity * item.menuItemId.price);
  }, 0) || 0;

useEffect(()=>{
    const script = document.createElement("script");
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
  script.async = true ;
    document.body.appendChild(script);
},[])

  const payload = {
    coupanCode: 'WEEKEND20',
    tableNumber: 1,
    customerEmail: user?.email || 'ritesh@gmail.com',
    customerName: user?.name || 'ritesh',
    customerPhone: user?.phone || 3423432,
    notes: 'add extra sugar',
    paymentMethod: 'razorpay',
  };
  const paymethod = 'razorpay';
  console.log(payload);
  const handlePlaceOrder = async () => {
    try {
      const result = await api.post('/orders', payload);
      console.log(result);
      const options = {
        key: result.data.razorPayOrder.key,
        amount: result.data.razorPayOrder.amount,
        order_id : result.data.order.razorPayOrderId,
        currency: "INR",
        name: "Restaurant QR",
        description: "Test Transaction",
        handler: async function (response) {
            console.log(response)
            toast.success(`Payment ID: ${response.razorpay_payment_id}`);
             const result = await api.post('verify/payment', {paymentId : response.razorpay_payment_id , razorPayOrderId : response.razorpay_order_id , signature : response.razorpay_signature } );
          if(result.data.success){
            toast.success("Order successful!")
          }
        },
        prefill: {
            name: result.data.order.customerName,
            email: result.data.order.customerEmail,
            contact: result.data.order.customerPhone
        },
        theme: {
            color: "#1e2939"
        }
    };
 
    const razorpay = new window.Razorpay(options) ;
    console.log(razorpay)
    razorpay.open()
 
    } catch (error) {}
  };
  return (
    <div>
      <h1>Razor pay </h1>
      <div className="mt-4">
        <p className="text-lg font-semibold">Total Amount: ₹{totalAmount}</p>
      </div>
      <button
        onClick={handlePlaceOrder}
        className="flex items-center mt-20 gap-2 px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:bg-gray-800/70 transition-colors"
      >
        Pay and Place Order
      </button>


    </div>
  );
}
 
export default Checkout;