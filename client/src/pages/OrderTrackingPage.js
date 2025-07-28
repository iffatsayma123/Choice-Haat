// client/src/pages/OrderTrackingPage.js
import React, { useState } from 'react';
import Header      from '../components/header';
import Footer      from '../components/footer';
import ProductCard from '../components/ProductCard';
import CartItem    from '../components/CartItem';

import axios from 'axios';

const OrderTrackingPage = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);

  const trackOrder = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(`/api/orders/${orderNumber}`);
      setStatus(data.status);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-md">
        <h1 className="text-2xl font-semibold mb-6">Track Your Order</h1>
        <form onSubmit={trackOrder} className="space-y-4">
          <input
            type="text"
            placeholder="Order Number"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500"
          >
            Track
          </button>
        </form>

        {status && (
          <div className="mt-6 grid grid-cols-3 text-center">
            {['Placed', 'Shipped', 'Out for Delivery'].map((stage) => (
              <div
                key={stage}
                className={`p-4 border-t-2 ${
                  stage === status ? 'border-indigo-600 font-semibold' : 'border-gray-300 text-gray-500'
                }`}
              >
                {stage}
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default OrderTrackingPage;
