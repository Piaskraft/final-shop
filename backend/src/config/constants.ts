// backend/src/config/constants.ts

export const PAGINATION = {
  PAGE: 1,
  LIMIT: 10,
} as const;

export const DEFAULTS = {
  CUSTOMER_NAME: 'Guest',
  CUSTOMER_EMAIL: 'unknown@example.com',
  ORDER_STATUS: 'PENDING',
  PAGE: PAGINATION.PAGE,
  LIMIT: PAGINATION.LIMIT,
} as const;
