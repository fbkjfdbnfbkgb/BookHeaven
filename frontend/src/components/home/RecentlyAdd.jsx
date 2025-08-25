import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BookCart from '../BookCart/BookCart';
import Loader from '../Loader/Loader';

function RecentlyAdd() {
    const [Data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get("http://localhost:3000/api/v1/get-recent-books");
                console.log("API Response:", response.data);
                
                if (response.data && Array.isArray(response.data)) {
                    setData(response.data);
                } else if (response.data && Array.isArray(response.data.data)) {
                    setData(response.data.data);
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
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-8">
            <Loader />
            {error && <div className="mt-4 text-red-500 text-center">Error: {error}</div>}
        </div>
    );
    if (error) return <div className="text-center py-4 text-red-500">Error: {error}</div>;
    if (Data.length === 0) return <div className="text-center py-4">No recent books found</div>;

    return (
        <div className='mt-8 px-4'>
            <h4 className='text-3xl text-yellow-100'>Recently added books ({Data.length})</h4>
            {!Data && <div className='flex items-center justify-center my-8'> <Loader />
            </div>}
            <div className='my-8 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-5'>
                {Data.map((item, i) => (
                    <div key={i} className="book-cart-container">
                        <BookCart data={item} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RecentlyAdd;
