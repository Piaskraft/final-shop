import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="card">
      <h1 style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>
        Willkommen im Piaskraft Mini-Shop
      </h1>
      <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>
        Hier wirst du später eine moderne Produktliste mit MJW-Werkzeugen
        sehen. Jetzt to tylko szkielet – backend już działa, za chwilę
        podepniemy API.
      </p>
      <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>
        Następny krok: pobieranie produktów z Nest API i wyświetlanie kart
        produktów na tej stronie.
      </p>
    </div>
  );
};

export default HomePage;
