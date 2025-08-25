import React from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Loader from '../Loader/Loader';
import { FaShoppingCart, FaHeart, FaEdit, FaTrash } from "react-icons/fa";
import { useSelector } from 'react-redux';
import Modal from 'react-modal'; // at the top
// Animation styles
const fadeInStyle = {
    animation: 'fadeInCard 0.7s ease'
};

const ViewBookDetails = () => {
    const {id} = useParams();

    const [Data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [editLoading, setEditLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const role = useSelector((state)=>state.auth.role);

  const isLoggedIn = useSelector((state)=>state.auth.isLoggedIn);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:3000/api/v1/get-book/${id}`);
                console.log("API Response:", response.data);

                const bookData = response.data?.data;
                console.log("Book Data:", bookData);

                if (bookData && bookData.book) {
                    setData(bookData.book);
                } else {
                    console.error("Unexpected data format:", response.data);
                    setError("Unexpected data format from API");
                }
            } catch (err) {
                console.error("Error fetching recent books:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        setEditForm({
            url: Data.url || "",
            title: Data.title || "",
            author: Data.author || "",
            price: Data.price || "",
            desc: Data.desc || "",
            language: Data.language || ""
        });
    }, [Data]);

    const headers = {
        'id': localStorage.getItem("id"),
        'Authorization': `Bearer ${localStorage.getItem("token")}`,
        'bookid': id
    };

    const handleFavourite = async () => {
        try {
            const response = await axios.put(
                'http://localhost:3000/api/v1/add-book-to-favourite',
                { bookId: id },
                { headers }
            );
            console.log(response);
            alert(response.data.message || "Book added to favourites");
        } catch (err) {
            alert("Error adding to favourites");
            console.error("Error adding favourite:", err);
        }

    };
    const handleRemoveFavourite = async () => {
        try {
            const response = await axios.put(
                'http://localhost:3000/api/v1/remove-book-from-favourite',
                { bookId: id },
                { headers }
            );
            alert(response.data.message || "Book removed from favourites");
        } catch (err) {
            alert("Error removing from favourites");
            console.error("Error removing favourite:", err);
        }
    };
    const handleCart = async () => {
        try {
            const response = await axios.put(
                'http://localhost:3000/api/v1/add-to-cart',
                { bookId: id },
                { headers }
            );
            console.log("Cart API response:", response); // <-- Debug log
            const message = response.data?.message?.toLowerCase() || "";
            if (message.includes("already in cart")) {
                alert("Book already in cart");
            } else if (message.includes("added to cart")) {
                alert("Book added to cart");
            } else {
                alert(response.data.message || "Action completed");
            }
        } catch (err) {
            console.error("Cart API error:", err); // <-- Debug log
            if (err.response && err.response.data && err.response.data.message) {
                alert(err.response.data.message);
            } else {
                alert("Error adding to cart");
            }
            console.error(err);
        }
    }

    // Edit Book Handler
    const handleEditBook = async (e) => {
        e.preventDefault();
        setEditLoading(true);
        try {
            await axios.put(
                `http://localhost:3000/api/v1/update-book/${id}`,
                editForm,
                { headers }
            );
            setShowEdit(false);
            window.location.reload();
        } catch (err) {
            alert("Error updating book");
        } finally {
            setEditLoading(false);
        }
    };

    // Delete Book Handler
    const handleDeleteBook = async () => {
        setDeleteLoading(true);
        try {
            await axios.delete(
                `http://localhost:3000/api/v1/delete-book/${id}`,
                { headers }
            );
            setShowDelete(false);
            window.location.href = "/"; // Redirect after delete
        } catch (err) {
            alert("Error deleting book");
        } finally {
            setDeleteLoading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center py-8 bg-zinc-900 min-h-screen w-full">
            <Loader />
        </div>
    );
    if (error) return (
        <div className="text-center py-4 text-red-500 bg-zinc-900 min-h-screen w-full">
            Error: {error}
        </div>
    );

    return (
        <>
            {/* Animation keyframes */}
            <style>
                {`
                @keyframes fadeInCard {
                    from { opacity: 0; transform: translateY(40px);}
                    to { opacity: 1; transform: translateY(0);}
                }
                `}
            </style>
            <div className='min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 px-4 py-12 flex items-center justify-center'>
                <div
                    className='flex flex-col md:flex-row gap-8 w-full max-w-5xl bg-zinc-800 rounded-xl shadow-2xl p-8 transition-all duration-500'
                    style={fadeInStyle}
                >
                    {/* Book Image & Action Icons */}
                    <div className='flex items-center justify-center md:w-2/5 w-full relative p-4'>
                        <div className="absolute inset-0 rounded-xl bg-white/10 border border-white/30 shadow-lg backdrop-blur-xl z-0"></div>
                        <div className="relative z-10 flex items-center justify-center w-full h-full">
                            {Data?.url
                                ? (
                                    <img
                                        src={Data.url}
                                        alt={Data.title || "Book"}
                                        className="max-h-[420px] max-w-full object-contain rounded-lg shadow-2xl transition-transform duration-300 hover:scale-105"
                                        style={{ boxShadow: '0 8px 32px 0 rgba(0,0,0,0.35)' }}
                                    />
                                )
                                : <span className="text-gray-400 text-base">No image available</span>
                            }
                            {/* Action Icons */}
                            {isLoggedIn === true && role === 'user' && (
                                <div className="absolute top-6 right-6 flex flex-col gap-4">
                                    <button 
                                        onClick={handleFavourite}
                                        className="group bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110">
                                        <FaHeart className="text-2xl text-zinc-800 transition-all duration-300 group-hover:rotate-[-20deg] group-hover:translate-x-1 group-hover:scale-125 group-hover:text-red-500" />
                                    </button>
                                    {/* Removed the "Remove from Favourites" button */}
                                    <button 
                                        onClick={handleCart}
                                        className="group bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110">
                                        <FaShoppingCart className="text-2xl text-zinc-800 transition-all duration-300 group-hover:rotate-[20deg] group-hover:-translate-x-1 group-hover:scale-125 group-hover:text-green-500" />
                                    </button>
                                </div>
                            )}
                            {isLoggedIn === true && role === 'admin' && (
                                <div className="absolute top-6 right-6 flex flex-col gap-4">
                                    <button
                                        className="group bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
                                        onClick={() => setShowEdit(true)}
                                    >
                                        <FaEdit className="text-2xl text-zinc-800 transition-all duration-300 group-hover:rotate-[10deg] group-hover:scale-125 group-hover:text-blue-500" />
                                    </button>
                                    <button
                                        className="group bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
                                        onClick={() => setShowDelete(true)}
                                    >
                                        <FaTrash className="text-2xl text-zinc-800 transition-all duration-300 group-hover:rotate-[-10deg] group-hover:scale-125 group-hover:text-red-600" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Book Details */}
                    <div className='flex flex-col justify-center md:w-3/5 w-full text-white px-4'>
                        <h2 className="text-4xl font-bold mb-4 text-blue-400 drop-shadow transition-colors duration-300 hover:text-blue-300">
                            {Data?.title || "No Title"}
                        </h2>
                        <p className="mb-2 text-lg">
                            <span className="font-semibold text-blue-300">by</span>
                            <span className="ml-2 transition-colors duration-300 hover:text-blue-200">{Data?.author || "Unknown"}</span>
                        </p>
                        <div className="mb-2 text-lg">
                            <span className="font-semibold text-blue-300">Category:</span>
                            <span className="ml-2 transition-colors duration-300 hover:text-blue-200">{Data?.category || "N/A"}</span>
                        </div>
                        <div className="mb-2 text-lg">
                            <span className="font-semibold text-blue-300">Price:</span>
                            <span className="text-green-400 font-bold ml-2 transition-colors duration-300 hover:text-green-300">{Data?.price ? `${Data.price}` : "N/A"}</span>
                        </div>
                        <div className="mt-6">
                            <span className="font-semibold text-lg text-blue-300">Description:</span>
                            <p className="mt-2 text-base text-gray-200 bg-zinc-900 rounded-lg p-4 shadow transition-all duration-300 hover:bg-zinc-800 hover:text-white">
                                {Data?.desc || "No description available."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            {/* Edit Modal */}
            <Modal
                isOpen={showEdit}
                onRequestClose={() => setShowEdit(false)}
                className="bg-zinc-900 p-8 rounded-xl max-w-lg w-full mx-auto shadow-2xl outline-none z-[1001] relative"
                overlayClassName="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000] overflow-y-auto"
                ariaHideApp={false}
            >
                <h2 className="text-2xl font-bold mb-4 text-blue-400">Edit Book</h2>
                <form onSubmit={handleEditBook} className="space-y-4">
                    <input name="url" value={editForm.url} onChange={e => setEditForm({ ...editForm, url: e.target.value })} placeholder="Image URL" required className="w-full p-2 rounded bg-zinc-800 border border-zinc-700" />
                    <input name="title" value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} placeholder="Title" required className="w-full p-2 rounded bg-zinc-800 border border-zinc-700" />
                    <input name="author" value={editForm.author} onChange={e => setEditForm({ ...editForm, author: e.target.value })} placeholder="Author" required className="w-full p-2 rounded bg-zinc-800 border border-zinc-700" />
                    <input name="price" value={editForm.price} onChange={e => setEditForm({ ...editForm, price: e.target.value })} placeholder="Price" required className="w-full p-2 rounded bg-zinc-800 border border-zinc-700" />
                    <input name="language" value={editForm.language} onChange={e => setEditForm({ ...editForm, language: e.target.value })} placeholder="Language" required className="w-full p-2 rounded bg-zinc-800 border border-zinc-700" />
                    <textarea name="desc" value={editForm.desc} onChange={e => setEditForm({ ...editForm, desc: e.target.value })} placeholder="Description" required className="w-full p-2 rounded bg-zinc-800 border border-zinc-700" />
                    <div className="flex gap-4">
                        <button type="submit" disabled={editLoading} className="py-2 px-6 bg-blue-600 rounded font-semibold hover:bg-blue-700 transition text-white">
                            {editLoading ? 'Saving...' : 'Save'}
                        </button>
                        <button type="button" onClick={() => setShowEdit(false)} className="py-2 px-6 bg-zinc-700 rounded font-semibold hover:bg-zinc-800 transition text-white">
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>
            {/* Delete Modal */}
            <Modal
                isOpen={showDelete}
                onRequestClose={() => setShowDelete(false)}
                className="bg-zinc-900 p-8 rounded-xl max-w-md w-full mx-auto shadow-2xl outline-none z-[1001] relative"
                overlayClassName="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000] overflow-y-auto"
                ariaHideApp={false}
            >
                <h2 className="text-xl font-bold mb-4 text-red-400">Delete Book</h2>
                <p className="mb-6 text-white">Are you sure you want to delete this book?</p>
                <div className="flex gap-4">
                    <button onClick={handleDeleteBook} disabled={deleteLoading} className="py-2 px-6 bg-red-600 rounded font-semibold hover:bg-red-700 transition text-white">
                        {deleteLoading ? 'Deleting...' : 'Delete'}
                    </button>
                    <button onClick={() => setShowDelete(false)} className="py-2 px-6 bg-zinc-700 rounded font-semibold hover:bg-zinc-800 transition text-white">
                        Cancel
                    </button>
                </div>
            </Modal>
        </>
    );
}



export default ViewBookDetails;

