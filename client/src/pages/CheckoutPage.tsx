import React from 'react';

const CheckoutPage: React.FC = () => {
  return (
    <div className="card">
      <h1 style={{ fontSize: '1.6rem', marginBottom: '0.75rem' }}>
        Bestellung abschließen
      </h1>
      <p style={{ color: '#9ca3af', marginBottom: '1rem' }}>
        Tutaj będzie Formularz zamówienia: dane klienta, adres, podsumowanie
        koszyka. Po wysłaniu wyślemy zamówienie do Nest API.
      </p>
      <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>
        Na razie to placeholder – ważne, że nawigacja i routing już działają.
      </p>
    </div>
  );
};

export default CheckoutPage;
