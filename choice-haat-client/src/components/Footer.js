import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-8 mt-10">
      <div className="container mx-auto text-center space-y-2">
        {/* FAQ and About Us links */}
        <div className="mb-2 flex justify-center gap-8">
          <Link to="/faq" className="text-blue-600 hover:underline font-medium">FAQ</Link>
          <Link to="/about" className="text-blue-600 hover:underline font-medium">About Us</Link>
        </div>
        {/* Copyright */}
        <div className="text-gray-600">
          © {new Date().getFullYear()} Choice Haat. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
