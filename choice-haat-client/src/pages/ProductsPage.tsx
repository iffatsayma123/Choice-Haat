import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api';
import ProductCard, { Product } from '../components/ProductCard';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ProductsPage() {
  const query = useQuery();
  const navigate = useNavigate();

  const initialQ = query.get('q') || '';
  const initialCategory = query.get('category') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState<string>(initialQ);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [loading, setLoading] = useState(false);

  // Build query string for API + URL
  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set('q', search.trim());
    if (selectedCategory.trim()) params.set('category', selectedCategory.trim());
    return params.toString();
  }, [search, selectedCategory]);

  // Load categories once
  useEffect(() => {
    api.get<string[]>('/categories').then(res => setCategories(res.data));
  }, []);

  // Fetch products when q/category changes (debounced)
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const url = queryString ? `/products?${queryString}` : '/products';
      api.get<Product[]>(url)
        .then(res => setProducts(res.data))
        .finally(() => setLoading(false));

      // keep URL in sync
      const nav = queryString ? `?${queryString}` : '';
      navigate(`/products${nav}`, { replace: true });
    }, 300);
    return () => clearTimeout(timer);
  }, [queryString, navigate]);

  return (
    <div className="container mx-auto">
      {/* Filters */}
      <div className="mb-6 grid gap-3 md:grid-cols-3">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search products..."
          className="border p-2 rounded w-full"
        />
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">All categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <button
          onClick={() => { setSearch(''); setSelectedCategory(''); }}
          className="border p-2 rounded w-full hover:bg-gray-50"
        >
          Clear filters
        </button>
      </div>

      {/* Results */}
      {loading ? (
        <div>Loading…</div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">No products found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map(product => (
            <ProductCard product={product} key={product._id} />
          ))}
        </div>
      )}
    </div>
  );
}
