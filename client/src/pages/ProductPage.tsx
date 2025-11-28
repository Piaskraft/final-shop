import React from 'react';
import { useParams } from 'react-router-dom';

const ProductPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  return (
    <div className="card">
      <h1 style={{ fontSize: '1.6rem', marginBottom: '0.75rem' }}>
        Produktdetails
      </h1>
      <p style={{ color: '#9ca3af' }}>
        Tutaj pokażemy szczegóły produktu o slug:
        <span style={{ color: '#f97316' }}> {slug}</span>.
        <br />
        W kolejnym kroku podłączymy tutaj zapytanie do API Nest + Prisma.
      </p>
    </div>
  );
};

export default ProductPage;
