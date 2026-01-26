// backend/src/config/constants.ts

export const PAGINATION = {
  DEFAULT_TAKE: 10,
  MAX_TAKE: 50,
} as const;

export const ORDER_LIMITS = {
  DEFAULT_TAKE: 10,
  MAX_TAKE: 50,
} as const;

export const DEFAULTS = {
  CUSTOMER_NAME: 'Unbekannter Kunde',
  CURRENCY: 'EUR',
} as const;

export const API = {
  PREFIX: '', // jak nie używasz global prefix, zostaw
} as const;
