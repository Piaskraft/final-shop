type ToNumberLike = { toNumber: () => number };

function hasToNumber(value: unknown): value is ToNumberLike {
  if (typeof value !== 'object' || value === null) return false;
  return (
    'toNumber' in value &&
    typeof (value as Record<string, unknown>).toNumber === 'function'
  );
}

export function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : fallback;
  }

  if (typeof value === 'string') {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  if (hasToNumber(value)) {
    const n = value.toNumber();
    return Number.isFinite(n) ? n : fallback;
  }

  return fallback;
}
