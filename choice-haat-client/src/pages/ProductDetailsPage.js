import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [added, setAdded] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/products/${id}`).then(res => setProduct(res.data));
  }, [id]);

  const handleAddToCart = () => {
    if (!user.id) {
      alert('Login needed to buy product');
      navigate('/login');
      return;
    }
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const found = cart.find(item => item._id === product._id);
    if (found) found.qty += 1;
    else cart.push({ ...product, qty: 1 });
    localStorage.setItem('cart', JSON.stringify(cart));
    setAdded(true);
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <img
        src={`http://localhost:5000/uploads/${product.image}`}
        alt={product.name}
        className="w-full h-192 object-cover  mb-4 rounded  bg-white"
      />
      <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
      <p className="mb-2 text-gray-700">৳{product.price}</p>
      <p className="mb-6">{product.description}</p>
      {!user.id ? (
        <div className="text-red-600 font-bold">Login needed to buy product</div>
      ) : (
        <button
          onClick={handleAddToCart}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {added ? "Added!" : "Add to Cart"}
        </button>
      )}
    </div>
  );
}
