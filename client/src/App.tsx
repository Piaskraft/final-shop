import { Link, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';

function App() {
  return (
    <div className="app-root">
      <header className="app-header">
        <div className="app-logo">Piaskraft Mini</div>
        <nav className="app-nav">
          <Link to="/">Start</Link>
          <Link to="/cart">Warenkorb</Link>
          <Link to="/checkout">Bestellung</Link>
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:slug" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </main>

      <footer className="app-footer">
        © {new Date().getFullYear()} Piaskraft – Demo-Shop für Abschlussprojekt
      </footer>
    </div>
  );
}

export default App;
