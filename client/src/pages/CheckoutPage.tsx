// client/src/pages/CheckoutPage.tsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import type { RootState, AppDispatch } from '../store';
import type { CartItem } from '../features/cartSlice';
import { selectCartItems, selectCartTotal, clearCart } from '../features/cartSlice';
import { API_URL } from '../api';

const CheckoutPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const items = useSelector<RootState, CartItem[]>(selectCartItems);
  const total = useSelector<RootState, number>(selectCartTotal);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const readErrorMessage = async (response: Response) => {
    const text = await response.text();
    try {
      const data = JSON.parse(text);
      if (Array.isArray(data?.message)) return data.message.join(', ');
      if (typeof data?.message === 'string') return data.message;
      return text;
    } catch {
      return text;
    }
  };

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
      const payload = {
        name,
        email,
        phone: phone?.trim() ? phone.trim() : null,
        street,
        postalCode,
        city,
        notes: notes?.trim() ? notes.trim() : null,
        items: items.map((item) => ({
          productId: Number(item.product.id),   // MUST be integer
          quantity: Number(item.quantity),
        })),
      };

      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const msg = await readErrorMessage(response);
        throw new Error(msg || `HTTP ${response.status}`);
      }

      setSuccess(true);
      dispatch(clearCart());
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Fehler beim Absenden der Bestellung';
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card">
      <h1>Bestellung abschließen</h1>
      <p>
        Hier siehst du eine Zusammenfassung deiner Bestellung und kannst deine Kontaktdaten eingeben.
      </p>

      <div className="checkout-grid">
        <div className="checkout-box">
          <h2>Rechnungsdaten</h2>

          {submitError && <div className="error-box">Fehler: {submitError}</div>}

          <form onSubmit={handleSubmit} style={{ marginTop: 12 }}>
            <div className="form-grid">
              <label className="full">
                Name*:
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>

              <label className="full">
                E-Mail*:
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>

              <label className="full">
                Telefon:
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </label>

              <label className="full">
                Straße und Hausnummer*:
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                />
              </label>

              <label>
                Postleitzahl*:
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </label>

              <label>
                Ort*:
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </label>

              <label className="full">
                Notiz zur Bestellung:
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </label>
            </div>

            <div className="form-actions">
              <Link to="/cart">Zurück zum Warenkorb</Link>

              <button type="submit" disabled={submitting}>
                {submitting ? 'Bestellung wird gesendet...' : 'Bestellung absenden'}
              </button>
            </div>
          </form>
        </div>

        <div className="checkout-box">
          <h2>Warenkorbübersicht</h2>

          <div className="checkout-summary" style={{ marginTop: 10 }}>
            {items.map((item) => (
              <div className="checkout-item" key={item.product.id}>
                <div>
                  <strong>{item.product.name}</strong>
                  <small>
                    {item.quantity} × {Number(item.product.price).toFixed(2)} €
                  </small>
                </div>
                <div>
                  <strong>
                    {(Number(item.product.price) * item.quantity).toFixed(2)} €
                  </strong>
                </div>
              </div>
            ))}

            <div className="checkout-total">Gesamt: {total.toFixed(2)} €</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
