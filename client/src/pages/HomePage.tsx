// client/src/pages/HomePage.tsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import type { RootState, AppDispatch } from '../store';
import {
  type Product,
  setProducts,
  setLoading,
  setError,
} from '../features/productsSlice';
import { addToCart } from '../features/cartSlice';
import { api } from '../api/apiClient';

const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { items: products, loading, error } = useSelector(
    (state: RootState) => state.products
  );

  const [thumbOk, setThumbOk] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loadProducts = async () => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        // ✅ api.get zwraca dane, nie { data }
        const data = (await api.get('/products')) as Product[];

        const normalized: Product[] = data.map((p: any) => ({
          ...p,
          price: Number(p.price),
        }));

        dispatch(setProducts(normalized));

        setThumbOk((prev) => {
          const next = { ...prev };
          normalized.forEach((p) => {
            if (next[p.slug] === undefined) next[p.slug] = true;
          });
          return next;
        });
      } catch (err: any) {
        dispatch(setError(err?.message ?? 'Fehler beim Laden der Produkte'));
      } finally {
        dispatch(setLoading(false));
      }
    };

    void loadProducts();
  }, [dispatch]);

  if (loading) return <div className="card">Lade Produkte…</div>;
  if (error) return <div className="card">Fehler: {error}</div>;

  return (
    <div className="card">
      <h1>Produkte</h1>

      <div className="card-list">
        {products.map((product) => (
          <article className="card" key={product.id}>
            <div className="card-thumb">
              {thumbOk[product.slug] !== false ? (
                <img
                  src={`/products/${product.slug}/1.jpg`}
                  alt={product.name}
                  loading="lazy"
                  onError={() =>
                    setThumbOk((prev) => ({ ...prev, [product.slug]: false }))
                  }
                />
              ) : (
                <div className="img-ph">Piaskraft</div>
              )}
            </div>

            <h2>{product.name}</h2>

            <p>
              <strong>{product.price.toFixed(2)} €</strong>
            </p>

            <button
              type="button"
              onClick={() => dispatch(addToCart({ product, quantity: 1 }))}
            >
              In den Warenkorb
            </button>

            <div style={{ marginTop: 10 }}>
              <Link to={`/product/${product.slug}`}>Details ansehen</Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
