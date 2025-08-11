import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

type CartItem = {
  _id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
  category?: string;
};

export default function CheckoutPage() {
  const [form, setForm] = useState({ name: '', address: '' });
  const [paymentMethod, setPaymentMethod] = useState<'COD'|'Card'>('COD');
  const [cardNumber, setCardNumber] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const cart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');
  const subtotal = cart.reduce((s, it) => s + it.price * it.qty, 0);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || user.isAdmin) {
      navigate('/login');
      return;
    }
    if (!form.name || !form.address) {
      setError('Please fill all fields');
      return;
    }
    if (paymentMethod === 'Card' && cardNumber.length < 12) {
      setError('Enter a valid card number');
      return;
    }
    try {
      const res = await api.post('/orders', {
        userId: user.id,
        name: form.name,
        address: form.address,
        paymentMethod,
        cardNumber: paymentMethod === 'Card' ? cardNumber : undefined,
        items: cart.map(c => ({
          _id: c._id, name: c.name, price: c.price, qty: c.qty, image: c.image, category: c.category
        })),
        total: subtotal,
      });
      localStorage.removeItem('cart');
      const orderId = res.data.order.orderId;
      navigate('/order-confirmation', { state: { orderId } });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Order failed');
    }
  };

  if (!cart.length) {
    return (
      <div className="max-w-lg mx-auto mt-10">
        Your cart is empty. <a href="/products" className="text-blue-600 underline">Go shopping</a>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-10">
      <h1 className="text-3xl font-semibold mb-6">Checkout</h1>
      <div className="mb-4 font-semibold">Total: <span className="text-blue-600">৳{subtotal.toFixed(2)}</span></div>
      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label className="block font-semibold mb-2">Name</label>
          <input className="w-full border p-2 rounded" value={form.name} onChange={e=>setForm(f=>({...f, name:e.target.value}))} required/>
        </div>
        <div>
          <label className="block font-semibold mb-2">Address</label>
          <textarea className="w-full border p-2 rounded" value={form.address} onChange={e=>setForm(f=>({...f, address:e.target.value}))} required/>
        </div>

        <div>
          <div className="font-semibold mb-2">Payment Method</div>
          <label className="mr-4">
            <input type="radio" checked={paymentMethod==='COD'} onChange={()=>setPaymentMethod('COD')} /> Cash on Delivery
          </label>
          <label className="ml-6">
            <input type="radio" checked={paymentMethod==='Card'} onChange={()=>setPaymentMethod('Card')} /> Card
          </label>
          {paymentMethod === 'Card' && (
            <input
              className="mt-3 w-full border p-2 rounded"
              placeholder="Card number"
              value={cardNumber}
              onChange={e=>setCardNumber(e.target.value)}
            />
          )}
        </div>

        {error && <div className="text-red-600">{error}</div>}
        <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700">
          Confirm Order
        </button>
      </form>
    </div>
  );
}
