import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ShoppingBag, RefreshCw, Calendar, Package, CheckCircle, Clock, XCircle, BookOpen } from 'lucide-react';

const statusOptions = ['pending', 'shipped', 'delivered', 'cancelled'];

const AllOrdersPage = () => {
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const headers = {
    "id": localStorage.getItem("id"),
    "Authorization": `Bearer ${localStorage.getItem("token")}`
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/v1/get-all-orders', { headers });
      setOrderHistory(response.data.orders || []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch order history");
      setOrderHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'pending':
      case 'processing':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'cancelled':
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Package className="w-5 h-5 text-blue-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'pending':
      case 'processing':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'cancelled':
      case 'failed':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await axios.put(
        `http://localhost:3000/api/v1/update-status/${orderId}`,
        { status: newStatus },
        { headers }
      );
      setOrderHistory(prev =>
        prev.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 p-6 overflow-y-auto hide-scrollbar">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="backdrop-blur-md bg-zinc-800/50 rounded-3xl border border-zinc-700/50 shadow-2xl p-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-zinc-600 to-zinc-700">
                <ShoppingBag className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Order History</h1>
                <p className="text-zinc-300 text-lg">
                  {orderHistory.length} order{orderHistory.length !== 1 ? 's' : ''} in your history
                </p>
              </div>
            </div>
            
            <button 
              onClick={fetchOrders}
              disabled={loading}
              className="flex items-center gap-3 px-6 py-3 bg-zinc-700/50 hover:bg-zinc-600/50 backdrop-blur-md rounded-2xl border border-zinc-600/50 text-white font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto mb-6">
          <div className="backdrop-blur-md bg-red-500/20 border border-red-500/30 rounded-2xl p-4">
            <p className="text-red-300 text-center">{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="max-w-7xl mx-auto">
          <div className="backdrop-blur-md bg-zinc-800/50 rounded-3xl border border-zinc-700/50 shadow-2xl p-12">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              <span className="ml-4 text-white text-lg">Loading your order history...</span>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && orderHistory.length === 0 && !error && (
        <div className="max-w-7xl mx-auto">
          <div className="backdrop-blur-md bg-zinc-800/50 rounded-3xl border border-zinc-700/50 shadow-2xl p-16 text-center">
            <div className="mb-6">
              <ShoppingBag className="w-24 h-24 text-zinc-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-4">No orders yet</h2>
              <p className="text-zinc-300 text-lg max-w-md mx-auto">
                Start shopping and your order history will appear here!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Orders List */}
      {!loading && orderHistory.length > 0 && (
        <div className="max-w-7xl mx-auto">
          <div className="space-y-6">
            {orderHistory.map((order, index) => (
              <div key={order._id} className="group">
                <div className="backdrop-blur-md bg-zinc-800/50 rounded-3xl border border-zinc-700/50 shadow-2xl overflow-hidden hover:bg-zinc-700/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-3xl">
                  <div className="p-8">
                    {/* Order Header */}
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-700/50">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30">
                          <Package className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">
                            Order #{order._id?.slice(-8).toUpperCase() || 'N/A'}
                          </h3>
                          <div className="flex items-center gap-2 text-zinc-300">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(order.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}</span>
                          </div>
                          {/* Show user info */}
                          {order.user && (
                            <div className="text-zinc-400 text-sm mt-1">
                              <span>User: {order.user.username || order.user.email || order.user._id}</span>
                              <span className="ml-2">Email: {order.user.email}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-md ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="font-medium capitalize">{order.status || 'Pending'}</span>
                      </div>
                      {/* Admin status change dropdown */}
                      <div className="ml-4">
                        <select
                          value={order.status}
                          onChange={e => handleStatusChange(order._id, e.target.value)}
                          disabled={updatingId === order._id}
                          className="bg-zinc-800 text-white border border-zinc-600 rounded-lg px-3 py-1"
                        >
                          {statusOptions.map(opt => (
                            <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Books Section */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-4">
                        <BookOpen className="w-5 h-5 text-zinc-400" />
                        <h4 className="text-lg font-semibold text-white">
                          Books ({order.books?.length || 0})
                        </h4>
                      </div>
                      
                      {order.books && order.books.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {order.books.map((book, bookIndex) => (
                            <div key={book._id || bookIndex} className="backdrop-blur-md bg-zinc-700/30 rounded-2xl border border-zinc-600/30 p-4 hover:bg-zinc-600/30 transition-all duration-300">
                              <div className="flex items-start gap-3">
                                {book.url && (
                                  <div className="flex-shrink-0">
                                    <img 
                                      src={book.url} 
                                      alt={book.title}
                                      className="w-12 h-16 object-cover rounded-lg border border-zinc-600/50"
                                    />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <h5 className="text-white font-medium mb-1 truncate">
                                    {book.title || 'Untitled'}
                                  </h5>
                                  {book.author && (
                                    <p className="text-zinc-400 text-sm mb-1">
                                      by {book.author}
                                    </p>
                                  )}
                                  {book.price && (
                                    <p className="text-green-400 text-sm font-medium">
                                      ${book.price}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="backdrop-blur-md bg-zinc-700/30 rounded-2xl border border-zinc-600/30 p-6 text-center">
                          <p className="text-zinc-400">No books found in this order</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8">
        <button
          onClick={fetchOrders}
          className="p-4 bg-gradient-to-r from-zinc-600 to-zinc-700 hover:from-zinc-700 hover:to-zinc-800 backdrop-blur-md rounded-full shadow-2xl text-white transition-all duration-300 hover:scale-110 hover:shadow-3xl"
          title="Refresh order history"
        >
          <RefreshCw className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  );
};

export default AllOrdersPage;