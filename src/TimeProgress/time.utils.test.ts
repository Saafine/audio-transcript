import {getMinutesFormatted } from './time.utils';

test('getMinutesFormatted', () => {
  const minute = 60 * 1000;
  const second = 1000;
  expect(getMinutesFormatted(4 * minute + 23 * second)).toBe('04:23');
  expect(getMinutesFormatted(123 * minute + 59 * second)).toBe('123:59');
  expect(getMinutesFormatted(0 * minute + 2 * second)).toBe('00:02');
  expect(getMinutesFormatted(0)).toBe('00:00');
});
