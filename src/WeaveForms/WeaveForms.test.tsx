import { getNoiseMarkers } from './noise-marking-utils';

test('returns noise markers for timing', () => {
  expect(getNoiseMarkers([{ startTimeMs: 0, endTimeMs: 9, word: '' }], 10)).toEqual([0]);
  expect(getNoiseMarkers([{ startTimeMs: 0, endTimeMs: 34, word: '' }], 10)).toEqual([0, 1, 2, 3]);
  expect(getNoiseMarkers([{ startTimeMs: 91, endTimeMs: 99, word: '' }], 10)).toEqual([9]);
});
