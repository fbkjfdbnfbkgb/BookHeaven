import BookCart from '../components/BookCart/BookCart';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ShoppingCart, RefreshCw, Trash2, BookOpen, Minus, Plus, CreditCard } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';

const Cart = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [Cart, setCart] = useState([]);
    const [Total, setTotal] = useState(0);
    const [error, setError] = useState(null);

    const headers = {
        'id': localStorage.getItem("id"),
        'Authorization': `Bearer ${localStorage.getItem("token")}`
    };

    // Calculate total price
    const calculateTotal = (cartArr) => {
        const total = cartArr.reduce((sum, book) => {
            const price = parseFloat(book.price) || 0;
            const qty = book.quantity || 1;
            return sum + price * qty;
        }, 0);
        setTotal(total);
    };

    // Fetch cart from API
    const fetchCart = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get('http://localhost:3000/api/v1/get-cart', { headers });
            console.log("Cart API response:", res); // Debug log
            console.log("Cart API response data:", res.data); // Show raw data
            let cartArr = [];
            if (Array.isArray(res.data)) {
                cartArr = res.data;
            } else if (Array.isArray(res.data.cart)) {
                cartArr = res.data.cart;
            } else {
                // Log unexpected data for debugging (detailed)
                console.warn("Unexpected cart API response format:", res.data, JSON.stringify(res.data, null, 2));
                cartArr = [];
            }
            setCart(cartArr);
            calculateTotal(cartArr);
        } catch (err) {
            console.error("Cart API error:", err); // Debug log
            setError('Failed to fetch cart.');
            setCart([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    };

    const removeFromCart = async (bookId) => {
        setLoading(true);
        setError(null);
        try {
            await axios.put(`http://localhost:3000/api/v1/remove-from-cart/${bookId}`, {}, { headers });
            // Refetch cart after removal
            await fetchCart();
        } catch (err) {
            setError('Failed to remove book from cart.');
        } finally {
            setLoading(false);
        }
    };

   const proceedToCheckout = async () => {
  if (Cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  // Only send _id and quantity for each book
  const booksPayload = Cart.map(book => ({
    _id: book._id,
    quantity: book.quantity || 1
  }));

  try {
    const response = await axios.post(
      "http://localhost:3000/api/v1/create-order",
      { books: booksPayload },
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          'id': localStorage.getItem("id"),
        },
      }
    );

    alert(response.data.message || "Order placed successfully!");
    navigate("/profile/orderHistory");
  } catch (error) {
    if (error.response && error.response.status === 400) {
      alert("Bad request: Please check your cart items and try again.");
    } else if (error.response && error.response.status === 500) {
      alert("Server error: Unable to place order. Please try again later.");
    } else {
      alert("Checkout failed. Please try again.");
    }
    console.error("Checkout error:", error);
  }
};

    useEffect(() => {
        fetchCart();
    }, []);

    return (
        <div className="min-h-screen bg-zinc-900 p-2 sm:p-4 md:p-6">
            {/* Header Section */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="backdrop-blur-md bg-zinc-800/50 rounded-3xl border border-zinc-700/50 shadow-2xl p-8">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700">
                                <ShoppingCart className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-white mb-2">Shopping Cart</h1>
                                <p className="text-zinc-300 text-lg">
                                    {Cart.length} item{Cart.length !== 1 ? 's' : ''} in your cart
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            {Cart.length > 0 && (
                                <div className="text-right">
                                    <p className="text-zinc-300 text-sm">Total Amount</p>
                                    <p className="text-3xl font-bold text-white">${Total.toFixed(2)}</p>
                                </div>
                            )}
                            
                            <button 
                                onClick={fetchCart}
                                disabled={loading}
                                className="flex items-center gap-3 px-6 py-3 bg-zinc-700/50 hover:bg-zinc-600/50 backdrop-blur-md rounded-2xl border border-zinc-600/50 text-white font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                                Refresh
                            </button>
                        </div>
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
                            <span className="ml-4 text-white text-lg">Loading your cart...</span>
                        </div>
                    </div>
                </div>
            )}

           {/* {/* Empty Cart State */}
            {!loading && Cart.length === 0 && !error && (
                <div className="max-w-7xl mx-auto">
                    <div className="backdrop-blur-md bg-zinc-800/50 rounded-3xl border border-zinc-700/50 shadow-2xl p-16 text-center">
                        <div className="mb-6">
                            <ShoppingCart className="w-24 h-24 text-zinc-400 mx-auto mb-4" />
                            <h2 className="text-3xl font-bold text-white mb-4">Your cart is empty</h2>
                            <p className="text-zinc-300 text-lg max-w-md mx-auto">
                                Discover amazing books and add them to your cart to get started!
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Cart Items */}
            {!loading && Cart.length > 0 && (
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Cart Items List */}
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {Cart.map((book, i) => (
                                <div key={book._id || i} className="group">
                                    <div className="backdrop-blur-md bg-zinc-800/50 rounded-2xl border border-zinc-700/50 shadow-xl overflow-hidden hover:bg-zinc-700/50 transition-all duration-300 flex flex-col h-full">
                                        <div className="p-4 flex flex-col h-full">
                                            <div className="flex flex-col items-center">
                                                {/* Book Image */}
                                                <img
                                                    src={book.url}
                                                    alt={book.title}
                                                    className="object-contain rounded-lg shadow-lg mb-2"
                                                    style={{ width: '120px', height: '160px' }}
                                                />
                                                {/* Book Info */}
                                                <div className="w-full text-center">
                                                    <div className="font-bold text-lg text-blue-300">{book.title}</div>
                                                    <div className="text-sm text-zinc-400 mb-1">{book.author}</div>
                                                    <div className="text-xs text-zinc-500 mb-2">{book.category}</div>
                                                </div>
                                            </div>
                                            {/* Price & Subtotal */}
                                            <div className="flex flex-col items-end mt-2">
                                                <div className="text-right">
                                                    <p className="text-zinc-400 text-xs">Price</p>
                                                    <p className="text-lg font-bold text-white">${book.price}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-zinc-400 text-xs">Subtotal</p>
                                                    <p className="text-base font-bold text-green-400">
                                                        ${((book.price) * (book.quantity || 1)).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                            {/* Remove Button */}
                                            <button
                                                onClick={() => removeFromCart(book._id)}
                                                className="mt-4 w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/40 rounded-xl border border-red-500/30 text-red-300 font-semibold transition-all duration-300 hover:scale-105"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:w-96 w-full">
                            <div className="backdrop-blur-md bg-zinc-800/50 rounded-3xl border border-zinc-700/50 shadow-2xl p-8 sticky top-6">
                                <h3 className="text-2xl font-bold text-white mb-6">Order Summary</h3>
                                
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-zinc-300">
                                        <span>Items ({Cart.length})</span>
                                        <span>${Total.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-zinc-300">
                                        <span>Shipping</span>
                                        <span>Free</span>
                                    </div>
                                    <div className="flex justify-between text-zinc-300">
                                        <span>Tax</span>
                                        <span>${(Total * 0.1).toFixed(2)}</span>
                                    </div>
                                    <hr className="border-zinc-600" />
                                    <div className="flex justify-between text-white text-xl font-bold">
                                        <span>Total</span>
                                        <span>${(Total + Total * 0.1).toFixed(2)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={proceedToCheckout}
                                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 backdrop-blur-md rounded-2xl border border-blue-500/50 text-white font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                                >
                                    <CreditCard className="w-6 h-6" />
                                    Place Order
                                </button>

                                <p className="text-zinc-400 text-sm text-center mt-4">
                                    Secure checkout with SSL encryption
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Action Button */}
            <div className="fixed bottom-8 right-8">
                <button
                    onClick={fetchCart}
                    className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 backdrop-blur-md rounded-full shadow-2xl text-white transition-all duration-300 hover:scale-110 hover:shadow-3xl"
                    title="Refresh cart"
                >
                    <RefreshCw className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>
        </div>
    );
};

export default Cart;