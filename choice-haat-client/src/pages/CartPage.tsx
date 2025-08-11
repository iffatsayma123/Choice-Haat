import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '../components/ProductCard';

type CartItem = Product & { qty: number };

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>(JSON.parse(localStorage.getItem('cart') || '[]'));
  const navigate = useNavigate();

  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const handleQtyChange = (id: string, qty: number) => {
    if (qty < 1) return;
    const newCart = cart.map(item =>
      item._id === id ? { ...item, qty } : item
    );
    updateCart(newCart);
  };

  const handleRemove = (id: string) => {
    const newCart = cart.filter(item => item._id !== id);
    updateCart(newCart);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      {cart.length === 0 ? (
        <div>
          <p className="mb-4">Your cart is empty.</p>
          <Link to="/products" className="text-blue-600 underline">Shop Now</Link>
        </div>
      ) : (
        <form>
          <div className="space-y-6">
            {cart.map(item => (
              <div key={item._id} className="flex items-center border-b py-4 gap-4">
                <img src={`https://choice-haat-backend-npzd.onrender.com/uploads/${item.image}`} alt={item.name} className="w-20 h-20 object-cover rounded border" />
                <div className="flex-1">
                  <div className="font-bold">{item.name}</div>
                  <div className="text-gray-500">৳{item.price}</div>
                  <input
                    type="number"
                    min={1}
                    value={item.qty}
                    onChange={e => handleQtyChange(item._id, parseInt(e.target.value))}
                    className="w-16 border rounded p-1 mt-1"
                  />
                </div>
                <button
                  type="button"
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700"
                  onClick={() => handleRemove(item._id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="mt-6 font-bold text-xl">
            Subtotal: <span className="text-blue-600">৳{subtotal}</span>
          </div>
          <button
            type="button"
            className="mt-6 w-full py-3 bg-yellow-400 text-black font-bold rounded hover:bg-yellow-300"
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
          </button>
        </form>
      )}
    </div>
  );
}
