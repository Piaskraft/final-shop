// client/src/pages/HomePage.tsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// typ produktu, którego używa frontend
type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;       // na froncie ZAWSZE liczba
  mainImage: string;
};

const API_URL = 'http://localhost:3000';

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        // lecimy bezpośrednio na Nest (port 3000)
        const res = await fetch(`${API_URL}/products`);

        if (!res.ok) {
          throw new Error('HTTP ' + res.status);
        }

        const raw = await res.json();

        // normalizacja price -> number (obsługa stringów itp.)
        const data: Product[] = raw.map((p: any) => {
          let priceNumber: number;

          if (typeof p.price === 'number') {
            priceNumber = p.price;
          } else if (typeof p.price === 'string') {
            // na wszelki wypadek zamiana przecinka na kropkę
            priceNumber = Number(p.price.replace(',', '.'));
          } else {
            priceNumber = 0;
          }

          return {
            id: p.id,
            name: p.name,
            slug: p.slug,
            description: p.description,
            price: priceNumber,
            mainImage: p.mainImage,
          };
        });

        setProducts(data);
      } catch (err: any) {
        setError(err.message ?? 'Fehler beim Laden der Produkte');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return <div className="card">Lade Produkte…</div>;
  }

  if (error) {
    return <div className="card">Fehler: {error}</div>;
  }

  return (
    <div className="card-list">
      {products.map((product) => (
        <article className="card" key={product.id}>
          <h2>{product.name}</h2>
          <p>{product.price.toFixed(2)} €</p>
          <Link to={`/product/${product.slug}`}>Details ansehen</Link>
        </article>
      ))}
    </div>
  );
};

export default HomePage;
