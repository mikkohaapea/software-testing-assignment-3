import { expect, test } from 'vitest';
import { calculateConversion } from '../utils/convert';

test('Calculate conversion', () => {
  expect(calculateConversion(10, 0.9)).toBe(9);
});