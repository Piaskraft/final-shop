// client/src/pages/CheckoutPage.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import type { RootState } from '../store';
import type { CartItem } from '../features/cartSlice';

const CheckoutPage: React.FC = () => {
  // bierzemy prawdziwe CartItem-y z reduxa
  const items = useSelector<RootState, CartItem[]>(
    (state) => state.cart.items
  );

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (items.length === 0) {
    return (
      <div className="card">
        <h1>Bestellung abschließen</h1>
        <p>Dein Warenkorb ist leer.</p>
        <p>
          <Link to="/">Zurück zum Shop</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <h1>Bestellung abschließen</h1>

      <p>
        Hier siehst du eine Zusammenfassung deiner Bestellung. Später kommt
        hier das Formular mit Kundendaten, Adresse und Zahlungsart.
      </p>

      <h2 style={{ marginTop: '1rem' }}>Warenkorbübersicht</h2>
      <ul>
        {items.map((item) => (
          <li key={item.product.id}>
            {item.product.name} × {item.quantity} –{' '}
            {item.product.price.toFixed(2)} € (Zwischensumme:{' '}
            {(item.product.price * item.quantity).toFixed(2)} €)
          </li>
        ))}
      </ul>

      <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>
        Gesamt: {total.toFixed(2)} €
      </p>

      <p style={{ marginTop: '1rem' }}>
        <Link to="/cart">Zurück zum Warenkorb</Link>
      </p>
    </div>
  );
};

export default CheckoutPage;
