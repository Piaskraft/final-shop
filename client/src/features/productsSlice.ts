// client/src/features/productsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;      // liczba, nie string
  mainImage: string;
};

type ProductsState = {
  items: Product[];
  loading: boolean;
  error: string | null;
};

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setProducts(state, action: PayloadAction<Product[]>) {
      state.items = action.payload;
    },
  },
});

export const { setLoading, setError, setProducts } = productsSlice.actions;
export default productsSlice.reducer;
