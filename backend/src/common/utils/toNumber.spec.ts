import { toNumber } from './toNumber';

describe('toNumber', () => {
  it('converts numbers and numeric strings', () => {
    expect(toNumber(12)).toBe(12);
    expect(toNumber('12')).toBe(12);
    expect(toNumber('12.5')).toBe(12.5);
  });

  it('returns 0 for invalid values', () => {
    expect(toNumber('abc')).toBe(0);
    expect(toNumber(undefined)).toBe(0);
    expect(toNumber(null)).toBe(0);
  });
});
