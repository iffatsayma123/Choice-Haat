import React, { useState } from 'react';
import api from '../api';

type Order = {
  orderId: string;
  name: string;
  address: string;
  total: number;
  date: string;
  status: string;
  items: { name: string; qty: number }[];
};

export default function OrderTrackingPage() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setOrder(null);
    try {
      const res = await api.get<Order>(`/orders/by-order-id/${orderId}`);
      setOrder(res.data);
    } catch {
      setError('Order not found.');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-semibold mb-6">Track Your Order</h1>
      <form onSubmit={handleTrack} className="space-y-6">
        <div>
          <label className="block font-semibold mb-2">Order ID</label>
          <input
            value={orderId}
            onChange={e => setOrderId(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="e.g., CH-20250808-1234"
            required
          />
        </div>
        <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700">Track</button>
      </form>
      {error && <div className="text-red-600 mt-4">{error}</div>}
      {order && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h2 className="font-bold mb-2">Order Status: {order.status}</h2>
          <p><strong>Order ID:</strong> {order.orderId}</p>
          <p><strong>Name:</strong> {order.name}</p>
          <p><strong>Address:</strong> {order.address}</p>
          <p><strong>Total:</strong> ৳{order.total.toFixed(2)}</p>
          <p><strong>Date:</strong> {new Date(order.date).toLocaleString()}</p>
          <p className="font-semibold mt-2">Items:</p>
          <ul className="list-disc pl-8">
            {order.items.map((it, idx) => <li key={idx}>{it.name} × {it.qty}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
