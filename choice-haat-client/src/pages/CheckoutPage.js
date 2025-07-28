import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function CheckoutPage() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', address: '', payment: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (!user.id) {
    navigate('/login');
    return null;
  }

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.address || !form.payment) {
      setError('Please fill all fields');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/orders', {
        userId: user.id,
        name: form.name,
        address: form.address,
        payment: form.payment,
        items: cart,
        total: subtotal,
      });
      localStorage.removeItem('cart');
      navigate(`/order-confirmation?id=${res.data.order._id}`);
    } catch (err) {
      setError('Order could not be placed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto mt-10">
      <h1 className="text-3xl font-semibold mb-6">Checkout</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty. <a href="/products" className="text-blue-600 underline">Go shopping</a></p>
      ) : (
        <>
          <div className="mb-6">
            <p className="font-semibold">Total: <span className="text-blue-600">৳{subtotal.toFixed(2)}</span></p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-semibold mb-2">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Address</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Payment Method</label>
              <select
                name="payment"
                value={form.payment}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              >
                <option value="">Select payment</option>
                <option value="Cash on Delivery">Cash on Delivery</option>
                <option value="Card">Card</option>
              </select>
            </div>
            {error && <div className="text-red-600">{error}</div>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
