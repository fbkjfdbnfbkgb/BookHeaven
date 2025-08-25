import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Heart, RefreshCw, Trash2, BookOpen } from 'lucide-react';

import BookCart from '../BookCart/BookCart';
const Favourites = () => {
    
    const [loading, setLoading] = useState(true);
    const [removingId, setRemovingId] = useState(null);
    const [FavouriteBooks, setFavouriteBooks] = useState([]); // initialize as array
    const headers = {
        'id': localStorage.getItem("id"),
        'Authorization': `Bearer ${localStorage.getItem("token")}`
    };
    const [error, setError] = useState(null);

    const fetchFavourites = async () => {
        setLoading(true); // ensure loading is set before fetch
        try {
            const response = await axios.get("http://localhost:3000/api/v1/get-favourites", { headers });
            console.log("Favourites API response:", response.data);
            setFavouriteBooks(response.data.favourites || []);
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to fetch favourites.';
            setError(msg);
            console.error(err);
        } finally {
            setLoading(false); // set loading to false after fetch
        }
    };

    useEffect(() => {
        fetchFavourites();
    }, []);


    const removeFromFavourites = async (bookId) => {
        try {
            setRemovingId(bookId);
            await axios.put(`http://localhost:3000/api/v1/remove-book-from-favourite`, 
                { bookid: bookId }, 
                { headers }
            );
            // Remove the book from local state
            setFavouriteBooks(prev => prev.filter(book => book._id !== bookId));
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to remove from favourites.';
            setError(msg);
            console.error(err);
        } finally {
            setRemovingId(null);
        }
    };

  
    return (
        <div className="min-h-screen bg-zinc-900 p-6">
            {/* Header Section */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="backdrop-blur-md bg-zinc-800/50 rounded-3xl border border-zinc-700/50 shadow-2xl p-8">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-gradient-to-r from-zinc-600 to-zinc-700">
                                <Heart className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-white mb-2">My Favourites</h1>
                                <p className="text-zinc-300 text-lg">
                                    {FavouriteBooks.length} book{FavouriteBooks.length !== 1 ? 's' : ''} in your collection
                                </p>
                            </div>
                        </div>
                        
                        <button 
                            onClick={fetchFavourites}
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
                            <span className="ml-4 text-white text-lg">Loading your favourites...</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!loading && FavouriteBooks.length === 0 && !error && (
                <div className="max-w-7xl mx-auto">
                    <div className="backdrop-blur-md bg-zinc-800/50 rounded-3xl border border-zinc-700/50 shadow-2xl p-16 text-center">
                        <div className="mb-6">
                            <BookOpen className="w-24 h-24 text-zinc-400 mx-auto mb-4" />
                            <h2 className="text-3xl font-bold text-white mb-4">No favourites yet</h2>
                            <p className="text-zinc-300 text-lg max-w-md mx-auto">
                                Start building your collection by adding books to your favourites!
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Books Grid */}
            {!loading && FavouriteBooks.length > 0 && (
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {FavouriteBooks.map((book, i) => (
                            <div key={book._id || i} className="group relative">
                                <div className="backdrop-blur-md bg-zinc-800/50 rounded-3xl border border-zinc-700/50 shadow-2xl overflow-hidden hover:bg-zinc-700/50 transition-all duration-300 hover:scale-105 hover:shadow-3xl">
                                    {/* Remove Button */}
                                    <button
                                        onClick={() => removeFromFavourites(book._id)}
                                        disabled={removingId === book._id}
                                        className="absolute top-4 right-4 z-10 p-2 bg-red-500/80 hover:bg-red-500 backdrop-blur-md rounded-full border border-red-400/50 text-white transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Remove from favourites"
                                    >
                                        {removingId === book._id ? (
                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="w-4 h-4" />
                                        )}
                                    </button>

                                    {/* Favourite Badge */}
                                    <div className="absolute top-4 left-4 z-10">
                                        <div className="p-2 bg-red-500/80 backdrop-blur-md rounded-full border border-red-400/50">
                                            <Heart className="w-4 h-4 text-white fill-current" />
                                        </div>
                                    </div>

                                    {/* Book Content */}
                                    <div className="p-6 pt-16">
                                        <BookCart data={book} />
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
                    onClick={fetchFavourites}
                    className="p-4 bg-gradient-to-r from-zinc-600 to-zinc-700 hover:from-zinc-700 hover:to-zinc-800 backdrop-blur-md rounded-full shadow-2xl text-white transition-all duration-300 hover:scale-110 hover:shadow-3xl"
                    title="Refresh favourites"
                >
                    <RefreshCw className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>
        </div>
    );
};

export default Favourites;


