// client/src/pages/CheckoutPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header      from '../components/header';
import Footer      from '../components/footer';
import ProductCard from '../components/ProductCard';
import CartItem    from '../components/CartItem';

import axios from 'axios';

const CheckoutPage = () => {
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [useAlt, setUseAlt] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const navigate = useNavigate();

  const placeOrder = async (e) => {
    e.preventDefault();
    // TODO: gather cart items and calculate total
    try {
      await axios.post('/api/orders', { contact, address, paymentMethod });
      navigate('/track-order');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-lg">
        <h1 className="text-2xl font-semibold mb-6">Checkout</h1>
        <form onSubmit={placeOrder} className="space-y-6">
          <div>
            <label className="block font-medium mb-1">Contact Information</label>
            <input
              type="text"
              placeholder="Email or Phone"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Shipping Address</label>
            <textarea
              placeholder="Address"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
            <label className="inline-flex items-center mt-2">
              <input
                type="checkbox"
                className="rounded focus:ring"
                checked={useAlt}
                onChange={(e) => setUseAlt(e.target.checked)}
              />
              <span className="ml-2">Use different shipping address</span>
            </label>
          </div>
          <div>
            <label className="block font-medium mb-1">Payment Method</label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  className="form-radio"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="ml-2">Card</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  className="form-radio"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="ml-2">Cash on Delivery</span>
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500"
          >
            Place Order
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;

