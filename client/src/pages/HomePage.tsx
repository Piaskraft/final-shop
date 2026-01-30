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
import {
  api,
  getRate,
  getWeather,
  type RateResponse,
  type WeatherResponse,
} from '../api/apiClient';
import { ROUTES } from '../config/constants';

const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { items: products, loading, error } = useSelector(
    (state: RootState) => state.products
  );

  const [thumbOk, setThumbOk] = useState<Record<string, boolean>>({});

  // external widgets (currency + weather)
  const [extLoading, setExtLoading] = useState(false);
  const [extError, setExtError] = useState<string | null>(null);
  const [rate, setRate] = useState<RateResponse | null>(null);
  const [weather, setWeather] = useState<WeatherResponse | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        // ✅ api.get zwraca dane, nie { data }
        const data = (await api.get('/products')) as Array<
          Product & { price: number | string }
        >;

        const normalized: Product[] = data.map((p) => ({
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

  useEffect(() => {
    const loadExternal = async () => {
      setExtLoading(true);
      setExtError(null);

      try {
        // Essen (DE) — możesz zmienić współrzędne jak chcesz
        const [r, w] = await Promise.all([
          getRate('EUR', 'PLN'),
          getWeather(51.4556, 7.0116),
        ]);

        setRate(r);
        setWeather(w);
      } catch (err: any) {
        setExtError(err?.message ?? 'Fehler beim Laden externer Daten');
      } finally {
        setExtLoading(false);
      }
    };

    void loadExternal();
  }, []);

  if (loading) return <div className="card">Lade Produkte…</div>;
  if (error) return <div className="card">Fehler: {error}</div>;

  return (
    <div className="card">
      <h1>Produkte</h1>

      {/* ===== External widgets (Rate + Weather) ===== */}
      <div className="card-list" style={{ marginBottom: 16 }}>
        <article className="card">
          <h2>Währungskurs</h2>

          {extError ? (
            <p style={{ opacity: 0.8 }}>Fehler: {extError}</p>
          ) : !rate && extLoading ? (
            <p>Lade…</p>
          ) : rate ? (
            <>
              <p>
                <strong>
                  1 {rate.base} = {Number(rate.rate).toFixed(4)} {rate.target}
                </strong>
              </p>
              <p style={{ opacity: 0.8, marginTop: 6 }}>
                Provider: {rate.provider}
                {rate.date ? ` • Datum: ${rate.date}` : ''}
              </p>
            </>
          ) : (
            <p style={{ opacity: 0.8 }}>—</p>
          )}
        </article>

        <article className="card">
          <h2>Wetter (Essen)</h2>

          {extError ? (
            <p style={{ opacity: 0.8 }}>Fehler: {extError}</p>
          ) : !weather && extLoading ? (
            <p>Lade…</p>
          ) : weather ? (
            <>
              <p>
                <strong>{Number(weather.temperature).toFixed(1)} °C</strong>
              </p>
              <p style={{ opacity: 0.8, marginTop: 6 }}>
                Wind: {Number(weather.windspeed).toFixed(1)} km/h • Code:{' '}
                {weather.weathercode}
              </p>
              <p style={{ opacity: 0.8, marginTop: 6 }}>
                Provider: {weather.provider} • Zeit: {weather.time}
              </p>
            </>
          ) : (
            <p style={{ opacity: 0.8 }}>—</p>
          )}
        </article>
      </div>

      {/* ===== Products list ===== */}
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
              <Link to={ROUTES.PRODUCT(product.slug)}>Details ansehen</Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
