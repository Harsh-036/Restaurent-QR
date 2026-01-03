import React from 'react';
import api from '../lib/api';
import { useEffect } from 'react';
function Checkout() {
 
useEffect(()=>{
    const script = document.createElement("script");
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
  script.async = true ;
    document.body.appendChild(script);
},[])
     
  const payload = {
    coupanCode: 'WEEKEND20',
    tableNumber: 1,
    customerEmail: 'ritesh@gmail.com',
    customerName: 'ritesh',
    customerPhone: 3423432,
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
        currency: "INR",
        name: "SavoryBites",
        description: "Test Transaction",
        handler: function (response) {
            console.log(response)
            alert(`Payment ID: ${response.razorpay_payment_id}`);
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
      <button
        onClick={handlePlaceOrder}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:bg-gray-800/70 transition-colors"
      >
        Pay and Place Order
      </button>
 
     
    </div>
  );
}
 
export default Checkout;