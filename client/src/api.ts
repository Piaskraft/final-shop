// client/src/api.ts

const raw =
  (process.env.REACT_APP_API_URL as string | undefined) ||
  'https://final-shop-qoz3.onrender.com';

export const API_URL = raw.replace(/\/$/, '');
