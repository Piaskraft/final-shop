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
  note: string; // opis / uwagi klienta do tego produktu
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
        state.items.push({
          product,
          quantity,
          note: '',
        });
      }
    },

    // zmiana ilości sztuk danego produktu
    updateQuantity(
      state,
      action: PayloadAction<{ productId: number; quantity: number }>
    ) {
      const { productId, quantity } = action.payload;
      const item = state.items.find(
        (cartItem) => cartItem.product.id === productId
      );

      if (!item) return;

      if (quantity <= 0) {
        // jeśli ilość <= 0, usuwamy z koszyka
        state.items = state.items.filter(
          (cartItem) => cartItem.product.id !== productId
        );
      } else {
        item.quantity = quantity;
      }
    },

    // zmiana notatki / opisu dla danego produktu
    updateNote(
      state,
      action: PayloadAction<{ productId: number; note: string }>
    ) {
      const { productId, note } = action.payload;
      const item = state.items.find(
        (cartItem) => cartItem.product.id === productId
      );
      if (!item) return;
      item.note = note;
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

export const {
  addToCart,
  updateQuantity,
  updateNote,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

// SELECTORY

export const selectCartItems = (state: RootState): CartItem[] =>
  state.cart.items;

export const selectCartTotal = (state: RootState): number =>
  state.cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
