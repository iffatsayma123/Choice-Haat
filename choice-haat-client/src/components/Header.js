import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.jpg'; // update the path if needed

export default function Header() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
    window.location.reload();
  };

  return (
    <header className="bg-white shadow mb-8">
      <nav className="container mx-auto flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <img
            src={logo}
            alt="Choice Haat"
            className="h-10 w-10 rounded-full border border-gray-300"
            style={{ background: "#FFC700" }}
          />
          <Link to="/" className="text-xl font-bold" style={{ color: '#FFC700' }}>
            Choice Haat
          </Link>
        </div>
        <div className="flex gap-6 items-center">
          <Link to="/products" className="nav-link">Products</Link>
          {/* Cart only for normal user */}
          {user && user.id && !user.isAdmin && (
            <Link to="/cart" className="nav-link">Cart</Link>
          )}
          {/* Order Tracking and My Orders for normal user */}
          {user && user.id && !user.isAdmin && (
            <>
              <Link to="/track" className="nav-link">Order Tracking</Link>
              <Link to="/my-orders" className="nav-link">My Orders</Link>
            </>
          )}
          {/* Admin Dashboard only for admin */}
          {user && user.isAdmin && (
            <Link to="/admin" className="nav-link font-bold text-red-600">Admin Dashboard</Link>
          )}
          {/* Right side: login/register/logout */}
          {user && user.id ? (
            <>
              <span className="ml-2 text-gray-600">Hi, {user.name}</span>
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
