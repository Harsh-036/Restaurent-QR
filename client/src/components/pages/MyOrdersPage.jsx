import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import socketService from '../../lib/socket';
import toast from 'react-hot-toast';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await api.get('/myorders');
        setOrders(response.data.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // WebSocket connection and event listeners for real-time updates
  useEffect(() => {
    socketService.connect();

    // Listen for order status updates
    socketService.onOrderStatusUpdated((updatedOrder) => {
      // Update the order in the local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );

      // Show toast notification based on status
      const statusMessages = {
        preparing: `🎉 Your order #${updatedOrder.orderNumber} is now being prepared!`,
        ready: `🍽️ Your order #${updatedOrder.orderNumber} is ready for pickup!`,
        served: `✅ Your order #${updatedOrder.orderNumber} has been served. Enjoy your meal!`
      };

      if (statusMessages[updatedOrder.orderStatus]) {
        toast.success(statusMessages[updatedOrder.orderStatus], {
          duration: 5000,
          position: 'top-right',
        });
      }
    });

    // Cleanup on unmount
    return () => {
      socketService.off('order:statusUpdated');
    };
  }, []);

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

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-400';
      case 'confirmed':
        return 'text-green-400';
      case 'failed':
        return 'text-red-400';
      default:
        return 'text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e1a35] via-[#162544] to-[#0e1a35] text-white mt-20">
      {/* Main Content */}
      <div className="p-6 flex justify-center items-start min-h-screen">
        <div className="w-full max-w-6xl">
          <h1 className="text-4xl font-bold text-white mb-8">My Orders</h1>

          {loading && (
            <div className="text-center py-12">
              <p className="text-gray-300 text-lg">Loading your orders...</p>
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
                        <p className="text-gray-300 text-sm">
                          {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)} bg-white/10 mb-2`}>
                          Order: {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                        </span>
                        <br />
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)} bg-white/10`}>
                          Payment: {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between items-center">
                        <p className="text-gray-300">
                          <span className="font-medium">Payment Method:</span> {order.paymentMethod}
                        </p>
                        <p className="text-gray-300">
                          <span className="font-medium">Total:</span> ₹{order.finalAmount}
                        </p>
                      </div>
                      {order.notes && (
                        <p className="text-gray-300 mt-2">
                          <span className="font-medium">Notes:</span> {order.notes}
                        </p>
                      )}
                    </div>

                    {/* Order Items */}
                    <div className="space-y-2">
                      <h4 className="text-lg font-medium text-white">Items:</h4>
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center bg-white/5 rounded-lg p-3">
                          <div>
                            <span className="text-white font-medium">{item.name}</span>
                            <span className="text-gray-300 ml-2">x{item.quantity} @ ₹{item.price}</span>
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
                  <p className="text-gray-300 text-lg">You have no orders yet.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrdersPage;
