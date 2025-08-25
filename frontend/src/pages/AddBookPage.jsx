import React, { useState } from 'react';
import axios from 'axios';

const initialState = {
  url: '',
  title: '',
  author: '',
  price: '',
  desc: '',
  language: ''
};

const AddBookPage = () => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const headers = {
        "id": localStorage.getItem("id"),
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      };
      const res = await axios.post('http://localhost:3000/api/v1/add-book', form, { headers });
      setMessage(res.data.message || 'Book added successfully');
      setForm(initialState);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error adding book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-zinc-900 p-8 rounded-2xl shadow-2xl text-white">
      <h2 className="text-2xl font-bold mb-6">Add Book</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="url" value={form.url} onChange={handleChange} placeholder="Image URL" required className="w-full p-2 rounded bg-zinc-800 border border-zinc-700" />
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required className="w-full p-2 rounded bg-zinc-800 border border-zinc-700" />
        <input name="author" value={form.author} onChange={handleChange} placeholder="Author" required className="w-full p-2 rounded bg-zinc-800 border border-zinc-700" />
        <input name="price" value={form.price} onChange={handleChange} placeholder="Price" required className="w-full p-2 rounded bg-zinc-800 border border-zinc-700" />
        <input name="language" value={form.language} onChange={handleChange} placeholder="Language" required className="w-full p-2 rounded bg-zinc-800 border border-zinc-700" />
        <textarea name="desc" value={form.desc} onChange={handleChange} placeholder="Description" required className="w-full p-2 rounded bg-zinc-800 border border-zinc-700" />
        <button type="submit" disabled={loading} className="w-full py-2 bg-blue-600 rounded font-semibold hover:bg-blue-700 transition">
          {loading ? 'Adding...' : 'Add Book'}
        </button>
      </form>
      {message && <div className="mt-4 text-center text-yellow-400">{message}</div>}
    </div>
  );
};

export default AddBookPage;
