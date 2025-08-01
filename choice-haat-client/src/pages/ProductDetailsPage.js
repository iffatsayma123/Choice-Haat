import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(() => setProduct(null));
  }, [id]);

  if (!product) return <div className="p-8 text-center">Product not found.</div>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <img src={`https://choice-haat-backend-npzd.onrender.com/uploads/${product.image}`} alt={product.name} className="mb-6 w-full max-h-96 object-contain" />
      <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
      <div className="text-lg font-semibold text-blue-700 mb-2">৳{product.price}</div>
      <div className="mb-4 text-gray-700">{product.description}</div>
      <button className="px-8 py-3 bg-yellow-400 text-black rounded font-bold hover:bg-yellow-300">
        Add to Cart
      </button>
    </div>
  );
}
