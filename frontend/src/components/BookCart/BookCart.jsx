import React from 'react';
import {Link} from 'react-router-dom';

const BookCart = ({ data }) => {
    // Accessing the correct prop name
    console.log("BookCart received:", data);
    
    if (!data) {
        return <div className="bg-zinc-800 rounded p-4 text-red-500">No book data available</div>;
    }
    
    return (
        <>
        <Link to={`/view-book-details/${data._id}`}>
        <div className='bg-zinc-800 rounded p-4 transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-900/20'>
            <div className='bg-zinc-900'>
                {data.url ? (
                    <img src={data.url} alt={data.title || "Book cover"} />
                ) : (
                    <div className="h-40 flex items-center justify-center text-gray-500">No image</div>
                )}
            </div>
            <div className="mt-2 text-white">
                <h3 className="font-bold">{data.title}</h3>
                <p className="text-sm text-gray-400">{data.author}</p>
                <p className="text-sm text-gray-400">{data.price}</p>
            </div>
        </div>
        </Link>
        </>
    );
}

export default BookCart;

