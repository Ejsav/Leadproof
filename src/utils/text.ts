export const cleanText = (value: string): string =>
  value.replace(/\s+/g, ' ').trim().toLowerCase();

export const includesAny = (haystack: string, needles: string[]): boolean => {
  const text = cleanText(haystack);
  return needles.some((needle) => text.includes(cleanText(needle)));
};

export const countOccurrences = (haystack: string, needles: string[]): number => {
  const text = cleanText(haystack);
  return needles.reduce(
    (count, needle) => count + (text.includes(cleanText(needle)) ? 1 : 0),
    0,
  );
};
