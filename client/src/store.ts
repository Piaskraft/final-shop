// client/src/store.ts
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './features/cartSlice';
import productsReducer from './features/productsSlice';

const CART_STORAGE_KEY = 'piaskraft_cart_v1';

// Wczytanie koszyka z localStorage (jeśli jest)
function loadCartState() {
  if (typeof window === 'undefined') return undefined;

  try {
    const serialized = localStorage.getItem(CART_STORAGE_KEY);
    if (!serialized) return undefined;
    return JSON.parse(serialized);
  } catch (e) {
    console.error('Nie udało się wczytać koszyka z localStorage', e);
    return undefined;
  }
}

// Stan startowy tylko dla koszyka
const preloadedCart = loadCartState();

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productsReducer,
    // jeśli masz inne reducery, dopisz je tutaj
  },
  // jeśli coś jest w localStorage → użyj tego jako startu
  preloadedState: preloadedCart ? { cart: preloadedCart } : undefined,
});

// Zapisywanie koszyka przy każdej zmianie stanu
store.subscribe(() => {
  if (typeof window === 'undefined') return;

  try {
    const state = store.getState();
    const cartState = state.cart; // cały slice koszyka
    const serialized = JSON.stringify(cartState);
    localStorage.setItem(CART_STORAGE_KEY, serialized);
  } catch (e) {
    console.error('Nie udało się zapisać koszyka do localStorage', e);
  }
});

// Typy
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
