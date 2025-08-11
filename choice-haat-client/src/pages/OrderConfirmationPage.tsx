import React from 'react';
import { Link } from 'react-router-dom';

export default function OrderConfirmationPage() {
  return (
    <div className="max-w-xl mx-auto mt-20 text-center">
      <h1 className="text-3xl font-bold mb-6 text-green-700">Thank you for your order!</h1>
      <p className="mb-8">Your order has been placed successfully.</p>
      <Link to="/products" className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Continue Shopping
      </Link>
    </div>
  );
}
