// client/src/config/constants.ts

export const API_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const ROUTES = {
  HOME: '/',
  PRODUCT: (slug: string) => `/products/${slug}`,
  CART: '/cart',
  CHECKOUT: '/checkout',
} as const;

export const UI = {
  PAGE_SIZE: 12,
} as const;
