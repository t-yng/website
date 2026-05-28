export const range = (start: number, count: number): number[] =>
  [...Array(count)].map((_, i) => i + start);
