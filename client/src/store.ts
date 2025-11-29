import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './features/productsSlice';
import cartReducer from './features/cartSlice';

/**
 * Wczytanie zapisanej zawartości koszyka z localStorage.
 * Zwracamy obiekt częściowego stanu Reduxa: { cart: ... }
 * albo undefined, jeśli nic nie ma / jest błąd.
 */
function loadCartFromStorage() {
  try {
    const serializedCart = localStorage.getItem('cart');

    if (!serializedCart) {
      return undefined;
    }

    const parsedCart = JSON.parse(serializedCart);

    // preloadedState może być częściowe – podajemy tylko cart
    return {
      cart: parsedCart,
    };
  } catch (error) {
    console.error('Nie udało się wczytać koszyka z localStorage:', error);
    return undefined;
  }
}

/**
 * Tworzymy store z preloadedState wczytanym z localStorage.
 */
export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
  },
  preloadedState: loadCartFromStorage(),
});

/**
 * Za każdym razem, gdy stan się zmieni, zapisujemy koszyk do localStorage.
 */
store.subscribe(() => {
  try {
    const state = store.getState();
    const serializedCart = JSON.stringify(state.cart);
    localStorage.setItem('cart', serializedCart);
  } catch (error) {
    console.error('Nie udało się zapisać koszyka do localStorage:', error);
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
