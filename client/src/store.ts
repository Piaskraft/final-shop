// client/src/store.ts
import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './features/productsSlice';
import cartReducer from './features/cartSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
  },
});

// typy dla hooków
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
