// client/src/config/constants.ts

const rawApiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
export const API_URL = rawApiUrl.replace(/\/$/, '');

export const ROUTES = {
  HOME: '/',
  PRODUCT: (slug: string) => `/product/${slug}`,

  CART: '/cart',
  CHECKOUT: '/checkout',
} as const;

export const UI = {
  PAGE_SIZE: 12,
} as const;
