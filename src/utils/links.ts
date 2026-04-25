export function isInternalLink(rootUrl: string, href: string): boolean {
  if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
    return false;
  }
  try {
    const root = new URL(rootUrl);
    const resolved = new URL(href, rootUrl);
    return resolved.hostname === root.hostname;
  } catch {
    return false;
  }
}

export function absolutizeLink(rootUrl: string, href: string): string | null {
  try {
    return new URL(href, rootUrl).toString();
  } catch {
    return null;
  }
}
