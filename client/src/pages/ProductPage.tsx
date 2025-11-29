// client/src/pages/ProductPage.tsx

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';
import { addToCart } from '../features/cartSlice';

type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  mainImage: string;
};

const ProductPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

useEffect(() => {
  const loadProduct = async () => {
    try {
      const res = await fetch(`/products/${slug}`);
      if (!res.ok) {
        throw new Error('HTTP ' + res.status);
      }

      const raw = await res.json();

      const normalized: Product = {
        ...raw,
        price: Number(raw.price),
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


  const handleAddToCart = () => {
    if (!product) return;
    dispatch(addToCart({ product, quantity }));
  };

  if (loading) {
    return <div className="card">Lade Produkt…</div>;
  }

  if (error || !product) {
    return <div className="card">Fehler: {error ?? 'Produkt nicht gefunden'}</div>;
  }

  return (
    <div className="card">
      <h1>{product.name}</h1>
      <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>
        {product.price.toFixed(2)} €
      </p>
      <p style={{ margin: '1rem 0' }}>{product.description}</p>

      {/* ilość + przycisk */}
      <div style={{ margin: '1rem 0' }}>
        <label>
          Menge:{' '}
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.max(1, Number(e.target.value) || 1))
            }
            style={{ width: '80px', marginRight: '0.5rem' }}
          />
        </label>
        <button onClick={handleAddToCart}>In den Warenkorb</button>
      </div>

      <p>
        <Link to="/cart">Zum Warenkorb</Link>
      </p>
    </div>
  );
};

export default ProductPage;
