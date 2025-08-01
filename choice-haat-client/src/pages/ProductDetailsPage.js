import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(() => setProduct(null));
  }, [id]);

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(item => item._id === product._id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Added to cart!');
  };

  if (!product) return <div className="p-8 text-center">Product not found.</div>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <img src={`https://choice-haat-backend-npzd.onrender.com/uploads/${product.image}`} alt={product.name} className="mb-6 w-full max-h-96 object-contain" />
      <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
      <div className="text-lg font-semibold text-blue-700 mb-2">৳{product.price}</div>
      <div className="mb-4 text-gray-700">{product.description}</div>

      {/* Add to cart button logic */}
      {user && user.isAdmin ? null : user && user.id ? (
        <button
          className="px-8 py-3 bg-yellow-400 text-black rounded font-bold hover:bg-yellow-300"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      ) : (
        <button
          className="px-8 py-3 bg-gray-400 text-white rounded cursor-not-allowed"
          onClick={() => navigate('/login')}
        >
          You need to login to buy products
        </button>
      )}
    </div>
  );
}
