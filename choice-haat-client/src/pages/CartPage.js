import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart') || '[]'));

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleRemove = id => {
    const updated = cart.filter(item => item._id !== id);
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      {cart.length === 0 ? (
        <div>Your cart is empty. <Link to="/products" className="text-blue-600 underline">Go shopping</Link></div>
      ) : (
        <>
          <ul>
            {cart.map(item => (
              <li key={item._id} className="flex justify-between items-center border-b py-2">
                <div>
                  <span className="font-semibold">{item.name}</span>
                  <span className="ml-2 text-gray-600">৳{item.price} × {item.qty}</span>
                </div>
                <button
                  onClick={() => handleRemove(item._id)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex justify-between font-bold text-lg">
            <span>Subtotal:</span>
            <span>৳{subtotal.toFixed(2)}</span>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => navigate('/checkout')}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
