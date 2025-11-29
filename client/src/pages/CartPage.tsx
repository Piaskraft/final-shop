// client/src/pages/CartPage.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import type { RootState, AppDispatch } from '../store';
import type { CartItem } from '../features/cartSlice';
import {
  selectCartItems,
  selectCartTotal,
  removeFromCart,
  clearCart,
  updateQuantity,
  updateNote,
} from '../features/cartSlice';

const CartPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const items = useSelector<RootState, CartItem[]>(selectCartItems);
  const total = useSelector<RootState, number>(selectCartTotal);

  if (items.length === 0) {
    return (
      <div className="card">
        <h1>Warenkorb</h1>
        <p>Dein Warenkorb ist leer.</p>
        <p>
          <Link to="/">Zurück zum Shop</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <h1>Warenkorb</h1>

      <ul>
        {items.map((item) => (
          <li key={item.product.id} style={{ marginBottom: '1rem' }}>
            <div>
              {item.product.name} ×{' '}
              <input
                type="number"
                min={1}
                value={item.quantity}
                style={{ width: '4rem' }}
                onChange={(e) =>
                  dispatch(
                    updateQuantity({
                      productId: item.product.id,
                      quantity: Number(e.target.value) || 1,
                    })
                  )
                }
              />{' '}
              – {(item.product.price * item.quantity).toFixed(2)} €
              <button
                type="button"
                onClick={() => dispatch(removeFromCart(item.product.id))}
                style={{ marginLeft: '0.5rem' }}
              >
                Entfernen
              </button>
            </div>

            <div style={{ marginTop: '0.25rem' }}>
              <label>
                Notiz zur Bestellung:{' '}
                <input
                  type="text"
                  style={{ width: '60%' }}
                  placeholder="z.B. Bitte als Geschenk verpacken"
                  value={item.note}
                  onChange={(e) =>
                    dispatch(
                      updateNote({
                        productId: item.product.id,
                        note: e.target.value,
                      })
                    )
                  }
                />
              </label>
            </div>
          </li>
        ))}
      </ul>

      <p style={{ fontWeight: 'bold' }}>Summe: {total.toFixed(2)} €</p>

      <div style={{ marginTop: '1rem' }}>
        <button type="button" onClick={() => dispatch(clearCart())}>
          Warenkorb leeren
        </button>
      </div>

      <p style={{ marginTop: '1rem' }}>
        <Link to="/checkout">Zur Kasse</Link>
      </p>
    </div>
  );
};

export default CartPage;
