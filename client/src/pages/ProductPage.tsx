// client/src/pages/ProductPage.tsx

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  mainImage: string;
};

const API_URL = 'http://localhost:3000';

const ProductPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const loadProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/products/${slug}`);

        if (!res.ok) {
          throw new Error('HTTP ' + res.status);
        }

        const raw = await res.json();

        const priceNumber =
          typeof raw.price === 'number'
            ? raw.price
            : Number(String(raw.price).replace(',', '.'));

        const normalized: Product = {
          id: raw.id,
          name: raw.name,
          slug: raw.slug,
          description: raw.description,
          price: priceNumber,
          mainImage: raw.mainImage,
        };

        setProduct(normalized);
      } catch (err: any) {
        setError(err.message ?? 'Fehler beim Laden des Produkts');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [slug]);

  if (loading) {
    return <div className="card">Lade Produkt…</div>;
  }

  if (error) {
    return <div className="card">Fehler: {error}</div>;
  }

  if (!product) {
    return <div className="card">Produkt nicht gefunden.</div>;
  }

  return (
    <div className="card">
      <h1>{product.name}</h1>
      <p>
        <strong>Preis:</strong> {product.price.toFixed(2)} €
      </p>
      <p>{product.description}</p>

      {/* na razie placeholder dla obrazka */}
      <p>
        <strong>Bild:</strong> {product.mainImage}
      </p>

      <p style={{ marginTop: '1rem' }}>
        <Link to="/">← Zurück zur Übersicht</Link>
      </p>
    </div>
  );
};

export default ProductPage;
