import React, { useState, useEffect } from 'react';
import api from '../api';

const CATEGORY_OPTIONS = [
  "Gadgets",
  "Tools",
  "Smart Watches"
];

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', image: '', description: '', category: '' });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // For order tracking
  const [trackOrderId, setTrackOrderId] = useState('');
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [trackError, setTrackError] = useState('');

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    const res = await api.get('/products');
    setProducts(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add product
  const handleAdd = async e => {
    e.preventDefault();
    await api.post('/products', form);
    setForm({ name: '', price: '', image: '', description: '', category: '' });
    fetchProducts();
  };

  // Delete product
  const handleDelete = async id => {
    await api.delete(`/products/${id}`);
    fetchProducts();
  };

  // Image upload handler
  const handleImageUpload = async e => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);
    const res = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    setForm(f => ({ ...f, image: res.data.filename }));
    setUploading(false);
  };

  // Admin order tracking handler
  const handleAdminTrack = async e => {
    e.preventDefault();
    setTrackError('');
    setTrackedOrder(null);
    try {
      const res = await api.get(`/orders/${trackOrderId}`);
      setTrackedOrder(res.data);
    } catch (err) {
      setTrackError('Order not found.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h1 className="text-3xl font-semibold mb-6">Admin Dashboard</h1>
      {/* Product Add Form */}
      <form onSubmit={handleAdd} className="bg-gray-100 rounded p-4 mb-8 space-y-4">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="flex-1 border p-2 rounded"
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={e => setForm({ ...form, price: e.target.value })}
            className="w-32 border p-2 rounded"
            required
          />
        </div>
        <select
          value={form.category}
          onChange={e => setForm({ ...form, category: e.target.value })}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select category</option>
          {CATEGORY_OPTIONS.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full border p-2 rounded"
        />
        {uploading && <div className="text-blue-600">Uploading image...</div>}
        {form.image && <div className="text-green-700">Uploaded: {form.image}</div>}
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Product
        </button>
      </form>
      {/* Product List */}
      <h2 className="text-2xl font-bold mb-4">All Products</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-4">
          {products.map(p => (
            <div key={p._id} className="flex items-center justify-between border-b py-2">
              <div>
                <div className="font-bold">{p.name}</div>
                <div className="text-gray-700">৳{p.price}</div>
                <div className="text-gray-400 text-sm">{p.category}</div>
                <div className="text-gray-400 text-sm">{p.image}</div>
              </div>
              <button
                onClick={() => handleDelete(p._id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Order Tracking Section for Admin */}
      <div className="mt-10 p-4 bg-gray-50 rounded">
        <h2 className="text-xl font-bold mb-4">Track Any Order</h2>
        <form onSubmit={handleAdminTrack} className="flex items-center gap-2 mb-4">
          <input
            value={trackOrderId}
            onChange={e => setTrackOrderId(e.target.value)}
            placeholder="Enter Order ID"
            className="flex-1 border p-2 rounded"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Track
          </button>
        </form>
        {trackError && <div className="text-red-600">{trackError}</div>}
        {trackedOrder && (
          <div className="mt-4 p-4 border rounded bg-white">
            <h3 className="font-bold mb-2">Order Details</h3>
            <p><strong>Name:</strong> {trackedOrder.name}</p>
            <p><strong>Address:</strong> {trackedOrder.address}</p>
            <p><strong>Total:</strong> ৳{trackedOrder.total?.toFixed(2)}</p>
            <p><strong>Date:</strong> {new Date(trackedOrder.date).toLocaleString()}</p>
            <p><strong>Items:</strong></p>
            <ul className="list-disc pl-8">
              {trackedOrder.items.map(item => (
                <li key={item._id || item.name}>{item.name} × {item.qty}</li>
              ))}
            </ul>
            {trackedOrder.status && (
              <div className="mt-4">
                <strong>Status:</strong> {trackedOrder.status}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
