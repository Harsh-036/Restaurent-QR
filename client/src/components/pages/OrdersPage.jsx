import Sidebar from '../Sidebar';
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, addOrder, updateOrder, removeOrder, updateOrderStatus } from '../../redux/orderSlice';
import socketService from '../../lib/socket';

const OrdersPage = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  // WebSocket connection and event listeners
  useEffect(() => {
    socketService.connect();

    // Listen for order events
    socketService.onOrderCreated((newOrder) => {
      dispatch(addOrder(newOrder));
    });

    socketService.onOrderStatusUpdated((updatedOrder) => {
      dispatch(updateOrder(updatedOrder));
    });

    // Cleanup on unmount
    return () => {
      socketService.off('order:created');
      socketService.off('order:statusUpdated');
    };
  }, [dispatch]);

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

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await dispatch(updateOrderStatus({ orderId, status: newStatus })).unwrap();
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e1a35] via-[#162544] to-[#0e1a35] text-white mt-20">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden fixed top-24 left-4 z-30 p-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg text-white"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="md:ml-64 p-4 md:p-6 flex justify-center items-start min-h-screen">
        <div className="w-full max-w-6xl">
          <h1 className="text-xl md:text-4xl font-bold text-white mb-6 md:mb-8">All Orders</h1>

          {loading && (
            <div className="text-center py-12">
              <p className="text-gray-300 text-lg">Loading orders...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-400 text-lg">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <>
              {/* Orders List */}
              <div className="space-y-6">
                {orders.map((order) => (
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
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)} bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                          <option value="pending">Pending</option>
                          <option value="preparing">Preparing</option>
                          <option value="ready">Ready</option>
                          <option value="served">Served</option>
                        </select>
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

              {orders.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-300 text-lg">No orders found.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
