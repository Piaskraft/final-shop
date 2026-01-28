// client/src/pages/ProductPage.tsx

import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { addToCart } from '../features/cartSlice';
import { API_URL } from '../config/constants';


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

  // unique + max 3
  const uniq = Array.from(new Set(all)).slice(0, 3);

  // zawsze 3 (dobij placeholderami)
  while (uniq.length < 3) uniq.push(PLACEHOLDER);

  return uniq.length ? uniq : [...FALLBACK_GALLERY];
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

  // toast
  const [toastOpen, setToastOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      setProduct(null);

      try {
        const res = await fetch(`${API_URL}/products/slug/${encodeURIComponent(slug)}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        const normalized: Product = { ...data, price: Number(data.price) };
        setProduct(normalized);
      } catch (e: any) {
        setError(e?.message ?? 'Produkt konnte nicht geladen werden');
      } finally {
        setLoading(false);
      }
    };

    if (slug) load();
  }, [slug]);

  // po załadowaniu produktu ustawiamy galerię (zawsze 3)
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

    // auto-hide po 3.5s
    window.clearTimeout((window as any).__pkToastT);
    (window as any).__pkToastT = window.setTimeout(() => setToastOpen(false), 3500);
  };

  const buyNow = () => {
    if (!product) return;
    dispatch(addToCart({ product, quantity: qty }));
    navigate('/checkout'); // dla mentora wygląda pro
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
                onClick={() => setActiveIndex((i) => (i - 1 + gallery.length) % gallery.length)}
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
