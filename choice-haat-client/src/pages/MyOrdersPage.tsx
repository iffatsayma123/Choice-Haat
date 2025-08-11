import React, { useEffect, useState } from 'react';
import api from '../api';

type Order = {
  _id: string;
  orderId: string;
  total: number;
  status: string;
  date: string;
  paymentMethod: 'COD'|'Card';
  cardLast4?: string;
  items: { name: string; qty: number }[];
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    if (!user) return;
    api.get<Order[]>(`/my-orders/${user.id}`).then(res => setOrders(res.data));
  }, [user]);

  if (!user) return <div className="max-w-3xl mx-auto">Please login to view your orders.</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      {!orders.length ? (
        <div>No orders yet.</div>
      ) : (
        <div className="space-y-4">
          {orders.map(o => (
            <div key={o._id} className="border rounded p-4 bg-white">
              <div className="font-semibold">Order ID: <span className="text-blue-700">{o.orderId}</span></div>
              <div>Status: {o.status}</div>
              <div>Total: ৳{o.total.toFixed(2)}</div>
              <div>Payment: {o.paymentMethod}{o.cardLast4 ? ` (•••• ${o.cardLast4})` : ''}</div>
              <div>Date: {new Date(o.date).toLocaleString()}</div>
              <ul className="list-disc pl-6 mt-2">
                {o.items.map((it, idx) => <li key={idx}>{it.name} × {it.qty}</li>)}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
