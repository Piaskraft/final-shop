import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store";
import { addToCart } from "../features/cartSlice";
import { API_URL } from "../api";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  slug: string;
}

const ProductPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);

  // karuzela
  const [activeIndex, setActiveIndex] = useState(0);
  const [imgOk, setImgOk] = useState([true, true, true]); // 1..3

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`${API_URL}/products/${slug}`);
      const data = await res.json();
      setProduct({ ...data, price: Number(data.price) });

      // reset przy zmianie produktu
      setQty(1);
      setActiveIndex(0);
      setImgOk([true, true, true]);
    };
    load();
  }, [slug]);

  const images = useMemo(() => {
    if (!product) return [];
    return [
      `/products/${product.slug}/1.jpg`,
      `/products/${product.slug}/2.jpg`,
      `/products/${product.slug}/3.jpg`,
    ];
  }, [product]);

  const visibleIndexes = images
    .map((_, i) => i)
    .filter((i) => imgOk[i]); // tylko te, które się wczytały

  const safeActiveIndex = visibleIndexes.includes(activeIndex)
    ? activeIndex
    : (visibleIndexes[0] ?? 0);

  const goPrev = () => {
    if (visibleIndexes.length === 0) return;
    const pos = visibleIndexes.indexOf(safeActiveIndex);
    const nextPos = (pos - 1 + visibleIndexes.length) % visibleIndexes.length;
    setActiveIndex(visibleIndexes[nextPos]);
  };

  const goNext = () => {
    if (visibleIndexes.length === 0) return;
    const pos = visibleIndexes.indexOf(safeActiveIndex);
    const nextPos = (pos + 1) % visibleIndexes.length;
    setActiveIndex(visibleIndexes[nextPos]);
  };

  if (!product) return <div className="card">Lade Produkt…</div>;

  return (
    <div className="card">
      <div className="product-layout">
        {/* LEFT */}
        <div className="carousel">
          <div className="carousel-main">
            {visibleIndexes.length > 0 ? (
              <>
                <button
                  type="button"
                  className="carousel-btn left"
                  onClick={goPrev}
                  aria-label="Previous image"
                >
                  ‹
                </button>

                <img
                  src={images[safeActiveIndex]}
                  alt={product.name}
                  onError={() => {
                    setImgOk((prev) => {
                      const copy = [...prev];
                      copy[safeActiveIndex] = false;
                      return copy;
                    });
                  }}
                />

                <button
                  type="button"
                  className="carousel-btn right"
                  onClick={goNext}
                  aria-label="Next image"
                >
                  ›
                </button>
              </>
            ) : (
              <div className="img-ph">Piaskraft</div>
            )}
          </div>

          <div className="carousel-thumbs">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={
                  "carousel-thumb" + (i === safeActiveIndex ? " active" : "")
                }
                onClick={() => setActiveIndex(i)}
              >
                {imgOk[i] ? (
                  <img
                    src={images[i]}
                    alt={`${product.name} ${i + 1}`}
                    onError={() => {
                      setImgOk((prev) => {
                        const copy = [...prev];
                        copy[i] = false;
                        return copy;
                      });
                    }}
                  />
                ) : (
                  <div className="img-ph">Piaskraft</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div>
          <h1>{product.name}</h1>
          <p>
            <strong>{product.price.toFixed(2)} €</strong>
          </p>

          <p>{product.description}</p>

          <div className="product-buy">
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) =>
                setQty(Math.max(1, Number(e.target.value) || 1))
              }
            />

            <button
              type="button"
              onClick={() => dispatch(addToCart({ product, quantity: qty }))}
            >
              In den Warenkorb
            </button>
          </div>

          <div style={{ marginTop: 16 }}>
            <Link to="/cart">Zum Warenkorb</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
