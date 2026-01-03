import Sidebar from '../Sidebar';
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const OrdersPage = () => {
  const navigate = useNavigate();

  // Dummy data based on project order model
  const dummyOrders = [
    {
      orderNumber: 'ORDER-12345678901234567890',
      items: [
        {
          name: 'Paneer Butter Masala',
          price: 250,
          quantity: 2,
          subTotal: 500,
        },
        {
          name: 'Chicken Biryani',
          price: 300,
          quantity: 1,
          subTotal: 300,
        },
      ],
      subTotal: 800,
      discountAmount: 50,
      finalAmount: 750,
      tableNumber: 5,
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      orderStatus: 'preparing',
      paymentMethod: 'razorpay',
      paymentStatus: 'success',
    },
    {
      orderNumber: 'ORDER-12345678901234567891',
      items: [
        {
          name: 'Veg Thali',
          price: 150,
          quantity: 3,
          subTotal: 450,
        },
      ],
      subTotal: 450,
      discountAmount: 0,
      finalAmount: 450,
      tableNumber: 2,
      customerName: 'Jane Smith',
      customerEmail: 'jane@example.com',
      orderStatus: 'ready',
      paymentMethod: 'cash',
      paymentStatus: 'pending',
    },
    {
      orderNumber: 'ORDER-12345678901234567892',
      items: [
        {
          name: 'Masala Dosa',
          price: 120,
          quantity: 1,
          subTotal: 120,
        },
        {
          name: 'Idli Sambar',
          price: 80,
          quantity: 2,
          subTotal: 160,
        },
        {
          name: 'Filter Coffee',
          price: 50,
          quantity: 1,
          subTotal: 50,
        },
      ],
      subTotal: 330,
      discountAmount: 20,
      finalAmount: 310,
      tableNumber: 8,
      customerName: 'Alice Johnson',
      customerEmail: 'alice@example.com',
      orderStatus: 'served',
      paymentMethod: 'razorpay',
      paymentStatus: 'success',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-400';
      case 'preparing':
        return 'text-blue-400';
      case 'ready':
        return 'text-green-400';
      case 'served':
        return 'text-gray-400';
      default:
        return 'text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e1a35] via-[#162544] to-[#0e1a35] text-white mt-20">
      <Sidebar/>

      {/* Main Content */}
      <div className="ml-64 p-6 flex justify-center items-start min-h-screen">
        <div className="w-full max-w-6xl">
          <h1 className="text-4xl font-bold text-white mb-8">All Orders</h1>

        {/* Orders List */}
        <div className="space-y-6">
          {dummyOrders.map((order) => (
            <div
              key={order.orderNumber}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:border-blue-500 transition"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    Order #{order.orderNumber}
                  </h3>
                  <p className="text-gray-300">Table {order.tableNumber}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)} bg-white/10`}>
                    {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-gray-300">
                    <span className="font-medium">Customer:</span> {order.customerName}
                  </p>
                  <p className="text-gray-300">
                    <span className="font-medium">Email:</span> {order.customerEmail}
                  </p>
                </div>
                <div>
                  <p className="text-gray-300">
                    <span className="font-medium">Payment:</span> {order.paymentMethod} ({order.paymentStatus})
                  </p>
                  <p className="text-gray-300">
                    <span className="font-medium">Total:</span> ₹{order.finalAmount}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-2">
                <h4 className="text-lg font-medium text-white">Items:</h4>
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center bg-white/5 rounded-lg p-3">
                    <div>
                      <span className="text-white font-medium">{item.name}</span>
                      <span className="text-gray-300 ml-2">x{item.quantity}</span>
                    </div>
                    <span className="text-white">₹{item.subTotal}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-white/20 flex justify-between text-white font-semibold">
                <span>Subtotal: ₹{order.subTotal}</span>
                {order.discountAmount > 0 && <span>Discount: -₹{order.discountAmount}</span>}
                <span>Final: ₹{order.finalAmount}</span>
              </div>
            </div>
          ))}
        </div>

        {dummyOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-300 text-lg">No orders found.</p>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
