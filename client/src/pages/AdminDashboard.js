// client/src/pages/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header      from '../components/header';
import Footer      from '../components/footer';
import ProductCard from '../components/ProductCard';
import CartItem    from '../components/CartItem';

import axios from 'axios';

const AdminDashboard = () => {
  const [summary, setSummary] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/admin/summary').then((res) => setSummary(res.data));
    axios.get('/api/orders?recent=true').then((res) => setRecentOrders(res.data));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow container mx-auto px-4 py-8 flex gap-8">
        <aside className="w-1/5 space-y-4">
          <p className="font-semibold cursor-pointer">Dashboard</p>
          <p className="cursor-pointer" onClick={() => navigate('/admin/orders')}>
            Orders
          </p>
          <p className="cursor-pointer" onClick={() => navigate('/admin/products')}>
            Products
          </p>
        </aside>
        <section className="w-4/5">
          <h2 className="text-2xl font-semibold mb-4">Overview</h2>
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-white rounded shadow text-center">
              <p className="text-sm text-gray-500">Total Sales</p>
              <p className="text-xl font-semibold mt-2">${summary.totalSales}</p>
            </div>
            <div className="p-6 bg-white rounded shadow text-center">
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-xl font-semibold mt-2">{summary.totalOrders}</p>
            </div>
            <div className="p-6 bg-white rounded shadow text-center">
              <p className="text-sm text-gray-500">Total Customers</p>
              <p className="text-xl font-semibold mt-2">{summary.totalCustomers}</p>
            </div>
          </div>

          <h3 className="text-xl font-semibold mb-2">Recent Orders</h3>
          <ul className="space-y-2">
            {recentOrders.map((order) => (
              <li key={order._id} className="p-4 border rounded flex justify-between">
                <span>#{order._id}</span>
                <span>{order.status}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
