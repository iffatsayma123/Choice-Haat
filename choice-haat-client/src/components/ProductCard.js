import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
      <Link to={`/products/${product._id}`}>
        <img
          src={`http://localhost:5000/uploads/${product.image}`}
          alt={product.name}
          className="w-full h-48 object-cover mb-4 rounded bg-white"
        />
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        <p className="text-blue-600 font-bold">৳{product.price}</p>
        <p className="text-gray-500 text-sm">{product.category}</p>
      </Link>
    </div>
  );
}


