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

      <div className="cart-list">
        {items.map((item) => (
          <div key={item.product.id}>
            <div className="cart-row">
              <div>
                <strong>{item.product.name}</strong>
                <small>
                  Einzelpreis: {Number(item.product.price).toFixed(2)} € • Summe:{' '}
                  {(Number(item.product.price) * item.quantity).toFixed(2)} €
                </small>
              </div>

              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) =>
                  dispatch(
                    updateQuantity({
                      productId: item.product.id,
                      quantity: Math.max(1, Number(e.target.value) || 1),
                    })
                  )
                }
              />

              <button
                type="button"
                onClick={() => dispatch(removeFromCart(item.product.id))}
              >
                Entfernen
              </button>
            </div>

            <div className="cart-note">
              <label>
                Notiz zur Bestellung
                <input
                  type="text"
                  placeholder="z.B. Bitte als Geschenk verpacken"
                  value={item.note ?? ''}
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
          </div>
        ))}
      </div>

      <div className="cart-actions">
        <div style={{ marginRight: 'auto', fontWeight: 800 }}>
          Summe: {total.toFixed(2)} €
        </div>

        <button type="button" onClick={() => dispatch(clearCart())}>
          Warenkorb leeren
        </button>

        <Link to="/checkout">
          <button type="button">Zur Kasse</button>
        </Link>
      </div>
    </div>
  );
};

export default CartPage;