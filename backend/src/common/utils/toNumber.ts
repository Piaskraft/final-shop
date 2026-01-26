type DecimalLike = { toNumber: () => number };

function isDecimalLike(value: unknown): value is DecimalLike {
  return (
    typeof value === 'object' &&
    value !== null &&
    'toNumber' in value &&
    typeof (value as Record<string, unknown>).toNumber === 'function'
  );
}

export function toNumber(value: unknown): number {
  if (typeof value === 'number') return value;
  if (isDecimalLike(value)) return value.toNumber();
  return Number(value);
}
