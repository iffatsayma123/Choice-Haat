import React, { useEffect, useState } from 'react';
import api from '../api';

type Product = {
  _id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category?: string;
};

type Order = {
  _id: string;
  orderId: string;
  user?: { name: string; email: string };
  name: string;
  address: string;
  total: number;
  status: 'Pending' | 'Out for Delivery' | 'Delivered';
  date: string;
  items: { name: string; qty: number }[];
  paymentMethod: 'COD'|'Card';
  cardLast4?: string;
};

const API_BASE = process.env.NODE_ENV === 'production'
  ? 'https://choice-haat-backend-npzd.onrender.com'
  : 'http://localhost:5000';

const categoriesSample = ['Gadgets', 'Tools', 'Smart Watches', 'Accessories', 'Other'];

export default function AdminDashboard() {
  const [tab, setTab] = useState<'products'|'orders'>('products');

  // PRODUCTS
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({ name: '', price: '', image: '', description: '', category: '' });
  const [uploading, setUploading] = useState(false);

  const fetchProducts = async () => {
    const res = await api.get<Product[]>('/products');
    setProducts(res.data);
  };
  useEffect(() => { fetchProducts(); }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    setUploading(true);
    const res = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    setForm(f => ({ ...f, image: res.data.filename }));
    setUploading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/products', {
      name: form.name,
      price: Number(form.price),
      image: form.image,
      description: form.description,
      category: form.category || undefined,
    });
    setForm({ name: '', price: '', image: '', description: '', category: '' });
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/products/${id}`);
    fetchProducts();
  };

  // ORDERS
  const [orders, setOrders] = useState<Order[]>([]);
  const fetchOrders = async () => {
    const res = await api.get<Order[]>('/admin/orders');
    setOrders(res.data);
  };
  useEffect(() => { if (tab === 'orders') fetchOrders(); }, [tab]);

  const changeStatus = async (id: string, status: Order['status']) => {
    await api.patch(`/admin/orders/${id}/status`, { status });
    fetchOrders();
  };

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <h1 className="text-3xl font-semibold mb-6">Admin Dashboard</h1>

      <div className="flex gap-4 mb-6">
        <button onClick={()=>setTab('products')} className={`px-4 py-2 rounded ${tab==='products'?'bg-blue-600 text-white':'bg-gray-200'}`}>Products</button>
        <button onClick={()=>setTab('orders')} className={`px-4 py-2 rounded ${tab==='orders'?'bg-blue-600 text-white':'bg-gray-200'}`}>Orders</button>
      </div>

      {tab === 'products' && (
        <>
          <form onSubmit={handleAdd} className="bg-gray-100 rounded p-4 mb-8 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input className="border p-2 rounded" placeholder="Name" value={form.name} onChange={e=>setForm(f=>({...f, name:e.target.value}))} required />
              <input className="border p-2 rounded" placeholder="Price" type="number" value={form.price} onChange={e=>setForm(f=>({...f, price:e.target.value}))} required />
              <select className="border p-2 rounded" value={form.category} onChange={e=>setForm(f=>({...f, category:e.target.value}))}>
                <option value="">Category (optional)</option>
                {categoriesSample.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input className="border p-2 rounded" placeholder="Description" value={form.description} onChange={e=>setForm(f=>({...f, description:e.target.value}))} required />
            </div>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full border p-2 rounded" />
            {uploading && <div className="text-blue-600">Uploading image...</div>}
            {form.image && (
              <div className="flex items-center gap-3 text-green-700">
                <span>Uploaded:</span>
                <img src={`${API_BASE}/uploads/${form.image}`} alt="preview" className="h-16 w-16 object-cover rounded border" />
                <span>{form.image}</span>
              </div>
            )}
            <button className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add Product</button>
          </form>

          <h2 className="text-2xl font-bold mb-4">All Products</h2>
          <div className="space-y-4">
            {products.map(p => (
              <div key={p._id} className="flex items-center justify-between border-b py-2">
                <div className="flex items-center gap-3">
                  <img src={`${API_BASE}/uploads/${p.image}`} alt={p.name} className="h-12 w-12 object-cover rounded border" />
                  <div>
                    <div className="font-bold">{p.name}</div>
                    <div className="text-gray-700">৳{p.price}</div>
                    <div className="text-gray-400 text-sm">{p.category}</div>
                  </div>
                </div>
                <button onClick={()=>handleDelete(p._id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700">
                  Delete
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'orders' && (
        <>
          <h2 className="text-2xl font-bold mb-4">All Orders</h2>
          {!orders.length ? (
            <div>No orders yet.</div>
          ) : (
            <div className="space-y-4">
              {orders.map(o => (
                <div key={o._id} className="border rounded p-4 bg-white">
                  <div className="font-semibold">Order ID: <span className="text-blue-700">{o.orderId}</span></div>
                  <div>Customer: {o.user?.name} ({o.user?.email})</div>
                  <div>Ship To: {o.name}, {o.address}</div>
                  <div>Total: ৳{o.total.toFixed(2)}</div>
                  <div>Payment: {o.paymentMethod}{o.cardLast4 ? ` (•••• ${o.cardLast4})` : ''}</div>
                  <div>Date: {new Date(o.date).toLocaleString()}</div>
                  <div className="mt-2">
                    <label className="mr-2 font-semibold">Status:</label>
                    <select
                      value={o.status}
                      onChange={e=>changeStatus(o._id, e.target.value as Order['status'])}
                      className="border p-2 rounded"
                    >
                      <option>Pending</option>
                      <option>Out for Delivery</option>
                      <option>Delivered</option>
                    </select>
                  </div>
                  <ul className="list-disc pl-6 mt-2">
                    {o.items.map((it, idx) => <li key={idx}>{it.name} × {it.qty}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
