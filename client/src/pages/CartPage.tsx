// client/src/pages/CartPage.tsx

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import type { RootState, AppDispatch } from '../store';
import { removeFromCart, clearCart } from '../features/cartSlice';

const CartPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector((state: RootState) => state.cart.items);

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (items.length === 0) {
    return (
      <div className="card">
        <h1>Warenkorb</h1>
        <p>Dein Warenkorb ist leer.</p>
        <Link to="/">Zurück zum Shop</Link>
      </div>
    );
  }

  return (
    <div className="card">
      <h1>Warenkorb</h1>

      <ul>
        {items.map((item) => (
          <li key={item.product.id}>
            {item.product.name} × {item.quantity} –{' '}
            {(item.product.price * item.quantity).toFixed(2)} €
            <button
              type="button"
              onClick={() => dispatch(removeFromCart(item.product.id))}
              style={{ marginLeft: '0.5rem' }}
            >
              Entfernen
            </button>
          </li>
        ))}
      </ul>

      <p style={{ marginTop: '1rem' }}>
        <strong>Summe:</strong> {total.toFixed(2)} €
      </p>

      <button
        type="button"
        onClick={() => dispatch(clearCart())}
        style={{ marginTop: '0.5rem' }}
      >
        Warenkorb leeren
      </button>

      <div style={{ marginTop: '1rem' }}>
        <Link to="/checkout">Zur Kasse</Link>
      </div>
    </div>
  );
};

export default CartPage;
