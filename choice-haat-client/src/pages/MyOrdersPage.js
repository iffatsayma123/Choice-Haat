import React, { useEffect, useState } from 'react';
import api from '../api';

export default function MyOrdersPage() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) return;
    api.get(`/my-orders/${user.id}`).then(res => setOrders(res.data));
  }, [user]);

  if (!user) return <div>Please login to view your orders.</div>;

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <div>No orders found.</div>
      ) : (
        orders.map(order => (
          <div key={order._id} className="border p-4 mb-4 rounded">
            <p><strong>Date:</strong> {new Date(order.date).toLocaleString()}</p>
            <p><strong>Total:</strong> ৳{order.total?.toFixed(2)}</p>
            <ul>
              {order.items.map(item => (
                <li key={item._id || item.name}>
                  {item.name} × {item.qty}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
