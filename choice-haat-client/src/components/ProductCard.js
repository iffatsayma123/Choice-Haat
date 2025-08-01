import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

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

  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
      <Link to={`/products/${product._id}`}>
        <img
          src={`https://choice-haat-backend-npzd.onrender.com/uploads/${product.image}`}
          alt={product.name}
          className="w-full h-48 object-cover mb-4 rounded bg-white"
        />
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        <p className="text-blue-600 font-bold">৳{product.price}</p>
        <p className="text-gray-500 text-sm">{product.category}</p>
      </Link>

      {/* Button logic */}
      {user && user.isAdmin ? null : user && user.id ? (
        <button
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      ) : (
        <button
          className="mt-2 px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed"
          onClick={() => navigate('/login')}
        >
          You need to login to buy products
        </button>
      )}
    </div>
  );
}



