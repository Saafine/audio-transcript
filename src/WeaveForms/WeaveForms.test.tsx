import { getNoiseMarkerForTiming } from './WeaveForms';

test('returns noise markers for timing', () => {
  expect(
    getNoiseMarkerForTiming({ startTimeMs: 0, endTimeMs: 9, word: '' }, 10),
  ).toEqual({ 0: true });

  expect(
    getNoiseMarkerForTiming({ startTimeMs: 0, endTimeMs: 34, word: '' }, 10),
  ).toEqual({ 0: true, 1: true, 2: true, 3: true });

  expect(
    getNoiseMarkerForTiming({ startTimeMs: 91, endTimeMs: 99, word: '' }, 10),
  ).toEqual({ 9: true });
  // expect(
  //   getNoiseMarkerForTiming({ startTimeMs: 6, endTimeMs: 7, word: '' }, 10),
  // ).toEqual({ 6: true });
  //
  // expect(
  //   getNoiseMarkerForTiming({ startTimeMs: 0, endTimeMs: 10, word: '' }, 10),
  // ).toEqual({ 10: true });
});
