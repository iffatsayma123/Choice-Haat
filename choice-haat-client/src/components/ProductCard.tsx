import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

export type Product = {
  _id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category?: string;
};

type Props = { product: Product };

// Use your Render base URL in prod, localhost in dev
const API_BASE =
  process.env.NODE_ENV === 'production'
    ? 'https://choice-haat-backend-npzd.onrender.com'
    : 'http://localhost:5000';

export default function ProductCard({ product }: Props) {
  const navigate = useNavigate();

  // Safely read user (null if absent or invalid)
  let user: { id?: string; isAdmin?: boolean } | null = null;
  try {
    user = JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    user = null;
  }

  const handleAddToCart = () => {
    // Safely read cart
    let cart: Array<Product & { qty: number }> = [];
    try {
      cart = JSON.parse(localStorage.getItem('cart') || '[]');
      if (!Array.isArray(cart)) cart = [];
    } catch {
      cart = [];
    }

    const existing = cart.find((item) => item._id === product._id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Added to cart!');
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow bg-white">
      <Link to={`/products/${product._id}`}>
        <img
          src={`${API_BASE}/uploads/${product.image}`}
          alt={product.name}
          className="w-full h-48 object-cover mb-4 rounded bg-white"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = `${API_BASE}/uploads/placeholder.png`;
          }}
        />
        <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
        {product.category && (
          <p className="text-gray-500 text-sm mb-1">{product.category}</p>
        )}
        <p className="text-blue-600 font-bold">৳{product.price}</p>
      </Link>

      {/* Buttons based on role */}
      {user?.isAdmin ? null : user?.id ? (
        <button
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      ) : (
        <button
          className="mt-3 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          onClick={() => navigate('/login')}
        >
          You need to login to buy
        </button>
      )}
    </div>
  );
}
