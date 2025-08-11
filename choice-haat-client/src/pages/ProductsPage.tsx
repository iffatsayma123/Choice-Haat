import React, { useEffect, useState } from 'react';
import api from '../api';
import ProductCard, { Product } from '../components/ProductCard';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    api.get('/products').then(res => setProducts(res.data));
    api.get('/categories').then(res => setCategories(res.data as string[]));
  }, []);

  const filtered = selectedCategory
    ? products.filter(
        p =>
          p.category &&
          p.category.trim().toLowerCase() === selectedCategory.trim().toLowerCase()
      )
    : products;

  return (
    <div className="container mx-auto">
      <div className="mb-6 flex gap-4 items-center">
        <label className="font-semibold">Filter by Category:</label>
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map(product => (
          <ProductCard product={product} key={product._id} />
        ))}
      </div>

      {!filtered.length && (
        <div className="text-center text-gray-500 mt-10">No products found for this category.</div>
      )}
    </div>
  );
}
