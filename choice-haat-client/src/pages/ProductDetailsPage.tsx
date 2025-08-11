import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

type Product = {
  _id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  category?: string;
};

type User = { id?: string; isAdmin?: boolean } | null;

const API_BASE =
  process.env.NODE_ENV === 'production'
    ? 'https://choice-haat-backend-npzd.onrender.com'
    : 'http://localhost:5000';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);

  // Safely parse user
  let user: User = null;
  try {
    user = JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    user = null;
  }

  useEffect(() => {
    if (!id) return;
    api.get<Product>(`/products/${id}`).then((res) => setProduct(res.data));
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    // Only customers can add to cart
    if (!user?.id || user?.isAdmin) {
      navigate('/login');
      return;
    }

    let cart: Array<Product & { qty: number }> = [];
    try {
      const raw = JSON.parse(localStorage.getItem('cart') || '[]');
      cart = Array.isArray(raw) ? raw : [];
    } catch {
      cart = [];
    }

    const existing = cart.find((it) => it._id === product._id);
    if (existing) existing.qty += 1;
    else cart.push({ ...product, qty: 1 });

    localStorage.setItem('cart', JSON.stringify(cart));
    navigate('/cart');
  };

  if (!product) return <div className="container mx-auto">Loading...</div>;

  return (
    <div className="container mx-auto grid md:grid-cols-2 gap-8">
      <img
        src={`${API_BASE}/uploads/${product.image}`}
        alt={product.name}
        className="w-full h-80 object-contain bg-white rounded"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = `${API_BASE}/uploads/placeholder.png`;
        }}
      />
      <div>
        <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
        {product.category && <p className="text-gray-500 mb-2">{product.category}</p>}
        <p className="text-blue-600 font-bold text-xl mb-4">৳{product.price}</p>
        {product.description && <p className="mb-6">{product.description}</p>}

        {/* Controls by role */}
        {user?.isAdmin ? null : user?.id ? (
          <button
            onClick={handleAddToCart}
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add to Cart
          </button>
        ) : (
          <button
            className="px-6 py-3 bg-gray-500 text-white rounded hover:bg-gray-600"
            onClick={() => navigate('/login')}
          >
            You need to login to buy
          </button>
        )}
      </div>
    </div>
  );
}
