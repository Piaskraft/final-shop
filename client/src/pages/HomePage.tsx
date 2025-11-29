// client/src/pages/HomePage.tsx

import React, { useEffect } from 'react';
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

const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { items: products, loading, error } = useSelector(
    (state: RootState) => state.products
  );

  useEffect(() => {
    const loadProducts = async () => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        const res = await fetch('/products');
        if (!res.ok) {
          throw new Error('HTTP ' + res.status);
        }

        const data = await res.json();

        // upewniamy się, że price jest liczbą
        const normalized: Product[] = data.map((p: any) => ({
          ...p,
          price: Number(p.price),
        }));

        dispatch(setProducts(normalized));
      } catch (err: any) {
        dispatch(
          setError(err?.message ?? 'Fehler beim Laden der Produkte')
        );
      } finally {
        dispatch(setLoading(false));
      }
    };

    loadProducts();
  }, [dispatch]);

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

       <button
  type="button"
  onClick={() => dispatch(addToCart({ product, quantity: 1 }))}
>
  In den Warenkorb
</button>

          <br />

          <Link to={`/product/${product.slug}`}>Details ansehen</Link>
        </article>
      ))}
    </div>
  );
};

export default HomePage;
