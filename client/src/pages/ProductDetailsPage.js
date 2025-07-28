import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header      from '../components/header';
import Footer      from '../components/footer';
import ProductCard from '../components/ProductCard';
import CartItem    from '../components/CartItem';

import axios from 'axios';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/products/${id}`).then(res => setProduct(res.data));
  }, [id]);

  if (!product) return <p className="text-center mt-8">Loading…</p>;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full md:w-1/2 h-auto object-cover rounded"
        />
        <div className="w-full md:w-1/2 flex flex-col space-y-4">
          <h2 className="text-3xl font-semibold">{product.name}</h2>
          <p className="text-xl text-indigo-600 font-semibold">
            ${product.price.toFixed(2)}
          </p>
          <p>{product.description}</p>
          <button
            onClick={() => {/* TODO: add to cart */}}
            className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-500 w-1/2"
          >
            Add to Cart
          </button>
          <button
            onClick={() => navigate(-1)}
            className="mt-2 text-gray-600 underline"
          >
            Back to Products
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
