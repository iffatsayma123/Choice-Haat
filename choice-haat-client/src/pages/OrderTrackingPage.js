import React, { useState } from 'react';
import api from '../api';

export default function OrderTrackingPage() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  const handleTrack = async e => {
    e.preventDefault();
    setError('');
    setOrder(null);
    try {
      const res = await api.get(`/orders/${orderId}`);
      setOrder(res.data);
    } catch (err) {
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
            required
            placeholder="Paste your Order ID here"
          />
        </div>
        <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700">Track</button>
      </form>
      {error && <div className="text-red-600 mt-4">{error}</div>}
      {order && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h2 className="font-bold mb-2">Order Status</h2>
          <p><strong>Name:</strong> {order.name}</p>
          <p><strong>Address:</strong> {order.address}</p>
         <p><strong>Total:</strong> ৳{order.total?.toFixed(2)}</p>

          <p><strong>Date:</strong> {new Date(order.date).toLocaleString()}</p>
          <p><strong>Items:</strong></p>
          <ul className="list-disc pl-8">
            {order.items.map(item => (
              <li key={item._id || item.name}>{item.name} × {item.qty}</li>
            ))}
          </ul>
          {/* If you add a status field in the future */}
          {order.status && (
            <div className="mt-4">
              <strong>Status:</strong> {order.status}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
