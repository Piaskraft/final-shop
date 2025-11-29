// client/src/features/cartSlice.ts

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { Product } from './productsSlice';

// produkt, który trzymamy w koszyku
export type ProductForCart = Pick<Product, 'id' | 'name' | 'price'>;

// pojedyncza pozycja w koszyku
export type CartItem = {
  product: ProductForCart;
  quantity: number;
};

type CartState = {
  items: CartItem[];
};

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // dodajemy produkt – z podaną ilością
    addToCart(
      state,
      action: PayloadAction<{ product: ProductForCart; quantity: number }>
    ) {
      const { product, quantity } = action.payload;

      const existing = state.items.find(
        (item) => item.product.id === product.id
      );

      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ product, quantity });
      }
    },

    // usuwamy wszystkie sztuki danego produktu
    removeFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter(
        (item) => item.product.id !== action.payload
      );
    },

    // czyścimy koszyk
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

// SELECTORY

export const selectCartItems = (state: RootState): CartItem[] =>
  state.cart.items;

export const selectCartTotal = (state: RootState): number =>
  state.cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
