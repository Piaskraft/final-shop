import React from 'react';

const CartPage: React.FC = () => {
  return (
    <div className="card">
      <h1 style={{ fontSize: '1.6rem', marginBottom: '0.75rem' }}>
        Warenkorb
      </h1>
      <p style={{ color: '#9ca3af' }}>
        Tutaj będzie lista produktów w koszyku, podsumowanie i przycisk „Zur
        Kasse”. Logika koszyka pojawi się, gdy dodamy Redux.
      </p>
    </div>
  );
};

export default CartPage;
