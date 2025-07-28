import React from 'react';
import { useLocation, Link } from 'react-router-dom';

export default function OrderConfirmationPage() {
  const location = useLocation();
  const orderId = new URLSearchParams(location.search).get('id');

  return (
    <div className="max-w-xl mx-auto mt-20 text-center">
      <h1 className="text-3xl font-bold mb-6 text-green-700">Thank you for your order!</h1>
      <p className="mb-2">Your order has been placed successfully.</p>
      {orderId && (
        <p className="mb-4">
          <span className="font-semibold">Your Order ID:</span>
          <span className="ml-2 select-all bg-gray-100 rounded px-2 py-1">{orderId}</span>
        </p>
      )}
      <Link to="/products" className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Continue Shopping
      </Link>
    </div>
  );
}
