export function normalizeUrl(url: string): string {
  const withProtocol = /^https?:\/\//i.test(url) ? url : `https://${url}`;
  return new URL(withProtocol).toString();
}
