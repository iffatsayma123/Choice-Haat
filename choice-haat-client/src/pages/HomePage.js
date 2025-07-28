import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const categories = ["Gadgets", "Tools", "Smart Watches"];

export default function HomePage() {
  const [loginMessage, setLoginMessage] = useState('');

  useEffect(() => {
    const msg = localStorage.getItem('loginMessage');
    if (msg) {
      setLoginMessage(msg);
      setTimeout(() => {
        setLoginMessage('');
        localStorage.removeItem('loginMessage');
      }, 2500);
    }
  }, []);

  return (
    <div className="container mx-auto">
      {loginMessage && (
        <div className="bg-green-100 text-green-700 rounded p-3 text-center font-medium mb-6">
          {loginMessage}
        </div>
      )}

      <section className="bg-gray-50 rounded-2xl p-10 text-center mt-10 mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to Choice Haat</h1>
        <p className="mb-6 text-lg">Your one-stop tech marketplace</p>
        <Link
          to="/products"
          className="px-6 py-3 bg-blue-600 text-white rounded text-lg hover:bg-blue-700"
        >
          Shop Now
        </Link>
      </section>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Shop by Category</h2>
        <div className="flex gap-4">
          {categories.map(cat => (
            <Link
              key={cat}
              to={`/products?category=${encodeURIComponent(cat)}`}
              className="border px-8 py-3 rounded-lg hover:bg-yellow-100 transition font-semibold text-lg"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
