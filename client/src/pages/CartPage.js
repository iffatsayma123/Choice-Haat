import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Header      from '../components/header';
import Footer      from '../components/footer';
import ProductCard from '../components/ProductCard';
import CartItem    from '../components/CartItem';


// import your cart context or state management here

export default function CartPage() {
  // TODO: replace with real cart context
  const cartItems = []; // e.g. useContext(CartContext)
  const total = cartItems.reduce((sum, i) => sum + i.qty * i.product.price, 0);
  const navigate = useNavigate();

  const handleQtyChange = (id, qty) => {
    // TODO: update cart context
  };
  const handleRemove = (id) => {
    // TODO: remove item from cart context
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">Your Cart</h1>
        {cartItems.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <div className="space-y-4">
            {cartItems.map(item => (
              <CartItem
                key={item.product._id}
                item={item}
                onQtyChange={handleQtyChange}
                onRemove={handleRemove}
              />
            ))}
          </div>
        )}
        <div className="mt-8 border-t pt-4 flex justify-between items-center">
          <p className="text-xl font-semibold">Total: ${total.toFixed(2)}</p>
          <button
            onClick={() => navigate('/checkout')}
            className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-500"
          >
            Proceed to Checkout
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
