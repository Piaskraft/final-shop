// client/src/pages/CheckoutPage.tsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import type { RootState, AppDispatch } from '../store';
import type { CartItem } from '../features/cartSlice';
import {
  selectCartItems,
  selectCartTotal,
  clearCart,
} from '../features/cartSlice';

const CheckoutPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const items = useSelector<RootState, CartItem[]>(selectCartItems);
  const total = useSelector<RootState, number>(selectCartTotal);

  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
   const [success, setSuccess] = useState(false);

  // widok po udanym zamówieniu
  if (success) {
    return (
      <div className="card">
        <h1>Bestellung abgeschlossen</h1>
        <p>Danke für deine Bestellung! Wir haben deine Daten erhalten.</p>
        <p>
          <Link to="/">Zurück zum Shop</Link>
        </p>
      </div>
    );
  }

  // zwykły pusty koszyk (gdy ktoś wejdzie na /checkout bez produktów)
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          email,
          phone: phone || null,
          street,
          postalCode,
          city,
          notes: notes || null,
          items: items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            unitPrice: item.product.price,
            itemNote: item.note || null,
          })),
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `HTTP ${response.status}`);
      }

      setSuccess(true);
      dispatch(clearCart());
    } catch (err: any) {
      setSubmitError(
        err?.message || 'Fehler beim Absenden der Bestellung',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card">
      <h1>Bestellung abschließen</h1>

      <p>
        Hier siehst du eine Zusammenfassung deiner Bestellung und kannst
        deine Kontaktdaten eingeben.
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

      <h2 style={{ marginTop: '2rem' }}>Rechnungsdaten</h2>

      {submitError && (
        <p style={{ color: 'red' }}>Fehler: {submitError}</p>
      )}
      {success && (
        <p style={{ color: 'green' }}>
          Danke für deine Bestellung! Wir haben deine Daten erhalten.
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ marginTop: '1rem', maxWidth: 400 }}
      >
        <div style={{ marginBottom: '0.5rem' }}>
          <label>
            Name*:
            <br />
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              style={{ width: '100%' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <label>
            E-Mail*:
            <br />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <label>
            Telefon:
            <br />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{ width: '100%' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <label>
            Straße und Hausnummer*:
            <br />
            <input
              type="text"
              required
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              style={{ width: '100%' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <label>
            Postleitzahl*:
            <br />
            <input
              type="text"
              required
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              style={{ width: '100%' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <label>
            Ort*:
            <br />
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              style={{ width: '100%' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <label>
            Notiz zur Bestellung:
            <br />
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              style={{ width: '100%' }}
            />
          </label>
        </div>

        <button type="submit" disabled={submitting}>
          {submitting
            ? 'Bestellung wird gesendet...'
            : 'Bestellung absenden'}
        </button>
      </form>

      <p style={{ marginTop: '1rem' }}>
        <Link to="/cart">Zurück zum Warenkorb</Link>
      </p>
    </div>
  );
};

export default CheckoutPage;
