import React from 'react';

export default function CartItem({ item, onUpdate, onRemove }) {
  return (
    <div className="flex items-center border-b py-4">
      <img
        src={item.image}
        alt={item.name}
        className="w-24 h-24 object-cover rounded mr-4"
      />
      <div className="flex-1">
        <h4 className="font-semibold">{item.name}</h4>
       <p className="text-blue-600 font-bold">৳{product.price}</p>

        <div className="mt-2 flex items-center">
          <input
            type="number"
            value={item.quantity}
            min="1"
            className="w-16 p-1 border rounded"
            onChange={e => onUpdate(item.id, Number(e.target.value))}
          />
          <button
            onClick={() => onRemove(item.id)}
            className="ml-4 text-red-500 hover:underline"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
