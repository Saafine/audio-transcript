function formatToDoubleDigit(value: number): string {
  const int = Math.floor(value);
  return int < 10 ? '0' + int : String(int);
}

export function getMinutesFormatted(timeMs: number): string {
  const seconds = timeMs / 1000;
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return formatToDoubleDigit(minutes) + ':' + formatToDoubleDigit(remainder);
}
