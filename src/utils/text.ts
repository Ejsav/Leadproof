export function normalizeText(text: string): string {
  return text.replace(/\s+/g, ' ').trim().toLowerCase();
}

export function includesAny(text: string, keywords: string[]): boolean {
  const normalized = normalizeText(text);
  return keywords.some((keyword) => normalized.includes(keyword.toLowerCase()));
}

export function countMatches(text: string, keywords: string[]): number {
  const normalized = normalizeText(text);
  return keywords.filter((keyword) => normalized.includes(keyword.toLowerCase())).length;
}
