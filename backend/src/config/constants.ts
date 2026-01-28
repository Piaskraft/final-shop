// client/src/config/constants.ts

const raw = process.env.REACT_APP_API_URL || 'http://localhost:3001';
export const API_URL = raw.replace(/\/$/, '');

export const ROUTES = {
  HOME: '/',
  PRODUCT: (slug: string) => `/product/${slug}`, 
  CART: '/cart',
  CHECKOUT: '/checkout',
} as const;


export const UI = {
  PAGE_SIZE: 12,
} as const;
