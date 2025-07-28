import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header      from '../components/header';
import Footer      from '../components/footer';
import ProductCard from '../components/ProductCard';
import CartItem    from '../components/CartItem';
;


import axios from 'axios';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const query = useQuery();
  const category = query.get('category') || 'All';

  useEffect(() => {
    const url = category === 'All'
      ? '/api/products'
      : `/api/products?category=${category}`;
    axios.get(url).then(res => setProducts(res.data));
  }, [category]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow container mx-auto px-4 py-8 flex">
        <aside className="w-1/4 pr-4">
          <h3 className="text-xl font-semibold mb-4">Categories</h3>
          {['All', 'Gadgets', 'Tools', 'Smart Devices'].map(cat => (
            <p
              key={cat}
              onClick={() => navigate(`/products?category=${cat}`)}
              className={`cursor-pointer mb-2 ${cat === category ? 'font-bold' : ''}`}
            >
              {cat}
            </p>
          ))}
        </aside>
        <section className="w-3/4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(p => (
            <ProductCard key={p._id} product={p} />
          ))}
        </section>
      </div>
      <Footer />
    </div>
  );
}
