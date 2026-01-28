// client/src/pages/ProductPage.tsx

import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { addToCart } from '../features/cartSlice';
import { api, ApiError } from '../api/apiClient';

type Product = {
  id: number;
  name: string;
  price: number;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
};

const PLACEHOLDER = '/products/placeholder.jpg';
const FALLBACK_GALLERY = [PLACEHOLDER, PLACEHOLDER, PLACEHOLDER];

function buildGallery(product: Product | null): string[] {
  if (!product) return [...FALLBACK_GALLERY];

  const local = [1, 2, 3].map((n) => `/products/${product.slug}/${n}.jpg`);
  const all = [product.imageUrl || null, ...local].filter(Boolean) as string[];

  const uniq = Array.from(new Set(all)).slice(0, 3);
  while (uniq.length < 3) uniq.push(PLACEHOLDER);

  return uniq.length ? uniq : [...FALLBACK_GALLERY];
}

function errorMsg(err: unknown): string {
  if (err instanceof ApiError) {
    const d: any = err.details;
    const m = d?.message;
    if (Array.isArray(m)) return m.join(' | ');
    if (typeof m === 'string') return m;
    if (typeof d?.error === 'string') return d.error;
    return err.message || `Request failed (${err.status})`;
  }
  if (err instanceof Error) return err.message;
  return 'Produkt konnte nicht geladen werden';
}

const ProductPage: React.FC = () => {
  const { slug = '' } = useParams<{ slug: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [gallery, setGallery] = useState<string[]>([...FALLBACK_GALLERY]);
  const [activeIndex, setActiveIndex] = useState(0);

  const [toastOpen, setToastOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      setProduct(null);

      try {
        const data = await api.get<Product>(
          `/products/slug/${encodeURIComponent(slug)}`
        );
        const normalized: Product = { ...data, price: Number((data as any).price) };
        setProduct(normalized);
      } catch (e) {
        setError(errorMsg(e));
      } finally {
        setLoading(false);
      }
    };

    if (slug) void load();
  }, [slug]);

  useEffect(() => {
    const g = buildGallery(product);
    setGallery(g);
    setActiveIndex(0);
    setToastOpen(false);
  }, [product]);

  const mainSrc = gallery[activeIndex] ?? PLACEHOLDER;

  const markBroken = (idx: number) => {
    setGallery((prev) => {
      const next = [...prev];
      next[idx] = PLACEHOLDER;
      return next;
    });
  };

  const addAndToast = () => {
    if (!product) return;
    dispatch(addToCart({ product, quantity: qty }));
    setToastOpen(true);

    window.clearTimeout((window as any).__pkToastT);
    (window as any).__pkToastT = window.setTimeout(() => setToastOpen(false), 3500);
  };

  const buyNow = () => {
    if (!product) return;
    dispatch(addToCart({ product, quantity: qty }));
    navigate('/checkout');
  };

  if (loading) return <div className="card">Lade Produkt…</div>;
  if (error) return <div className="card">Fehler: {error}</div>;
  if (!product) return <div className="card">Produkt nicht gefunden.</div>;

  return (
    <div className="card">
      <p>
        <Link to="/">← Zurück</Link>
      </p>

      <div className="product-layout">
        <div className="product-media">
          <div className="carousel">
            <div className="carousel-main">
              <button
                type="button"
                className="carousel-btn left"
                onClick={() =>
                  setActiveIndex((i) => (i - 1 + gallery.length) % gallery.length)
                }
                aria-label="Vorheriges Bild"
              >
                ‹
              </button>

              <img
                className="carousel-main-img"
                src={mainSrc}
                alt={product.name}
                onError={() => markBroken(activeIndex)}
              />

              <button
                type="button"
                className="carousel-btn right"
                onClick={() => setActiveIndex((i) => (i + 1) % gallery.length)}
                aria-label="Nächstes Bild"
              >
                ›
              </button>
            </div>

            <div className="carousel-thumbs">
              {gallery.map((src, idx) => (
                <button
                  key={`${src}-${idx}`}
                  type="button"
                  className={'carousel-thumb ' + (idx === activeIndex ? 'active' : '')}
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Bild ${idx + 1}`}
                >
                  <img
                    src={src}
                    alt={`${product.name} ${idx + 1}`}
                    loading="lazy"
                    onError={() => markBroken(idx)}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="product-info">
          <h1>{product.name}</h1>
          <div className="price">{product.price.toFixed(2)} €</div>
          {product.description && <p className="desc">{product.description}</p>}

          <div className="row">
            <label>
              Ilość:{' '}
              <input
                type="number"
                min={1}
                step={1}
                value={qty}
                onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
              />
            </label>

            <button type="button" onClick={addAndToast}>
              Zum Warenkorb hinzugefügt
            </button>

            <button type="button" onClick={buyNow}>
              Jetzt kaufen
            </button>
          </div>

          <p style={{ marginTop: 12 }}>
            <Link to="/cart">Zum Warenkorb</Link>
          </p>
        </div>
      </div>

      {toastOpen && (
        <div className="toast" role="status" aria-live="polite">
          <div className="toast-title">Zum Warenkorb hinzugefügt ✓</div>
          <div className="toast-actions">
            <button type="button" onClick={() => navigate('/checkout')}>
              Zur Kasse
            </button>
            <button type="button" onClick={() => setToastOpen(false)}>
              Weiter einkaufen
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
