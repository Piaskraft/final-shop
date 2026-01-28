// client/src/pages/ProductPage.tsx

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import type { AppDispatch } from '../store';
import { addToCart } from '../features/cartSlice';
import type { Product } from '../features/productsSlice';
import { API_URL } from '../api';

const ProductPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [qty, setQty] = useState(1);

  useEffect(() => {
    let canceled = false;

    async function fetchProduct() {
      if (!slug) return;
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_URL}/products/slug/${encodeURIComponent(slug)}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as Product;
        if (!canceled) setProduct(data);
      } catch (err) {
        if (!canceled) setError('Nie udało się pobrać produktu');
      } finally {
        if (!canceled) setLoading(false);
      }
    }

    void fetchProduct();
    return () => {
      canceled = true;
    };
  }, [slug]);

  const handleAdd = () => {
    if (!product) return;

    dispatch(
      addToCart({
        product: {
          id: Number(product.id),
          name: product.name,
          price: Number(product.price),
        },
        quantity: qty,
      })
    );
  };

  if (loading) return <div className="card">Ładowanie...</div>;
  if (error) return <div className="card">Błąd: {error}</div>;
  if (!product) return <div className="card">Nie znaleziono produktu.</div>;

  return (
    <div className="card product-page">
      <p style={{ marginBottom: 10 }}>
        <Link to="/">← Wróć</Link>
      </p>

      <div className="product-grid">
        <div className="product-image">
          <img
            src={`/products/${product.slug}/1.jpg`}
            alt={product.name}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/products/placeholder.jpg';
            }}
          />
        </div>

        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="price">{Number(product.price).toFixed(2)} €</p>
          <p className="desc">{product.description}</p>

          <div className="product-actions">
            <label>
              Ilość:
              <input
                type="number"
                min={1}
                value={qty}
                onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                style={{ width: 80, marginLeft: 8 }}
              />
            </label>

            <button onClick={handleAdd}>Dodaj do koszyka</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
