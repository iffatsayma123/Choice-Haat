import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header      from '../components/header';
import Footer      from '../components/footer';
import ProductCard from '../components/ProductCard';
import CartItem    from '../components/CartItem';


import axios from 'axios';

export default function HomePage() {
  const [deals, setDeals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/products').then(res => {
      setDeals(res.data.slice(0, 8));
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Hero */}
        <section className="bg-indigo-600 text-white rounded-lg p-12 text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Your One-Stop Tech Shop</h1>
          <button
            onClick={() => navigate('/products')}
            className="mt-4 px-6 py-3 bg-white text-indigo-600 font-semibold rounded shadow hover:bg-gray-100"
          >
            Shop Now
          </button>
        </section>

        {/* Featured Products */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {deals.map(prod => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
