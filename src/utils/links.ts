export const isInternalLink = (baseUrl: string, href: string): boolean => {
  try {
    const base = new URL(baseUrl);
    const target = new URL(href, baseUrl);
    return base.hostname === target.hostname;
  } catch {
    return false;
  }
};

export const toAbsoluteUrl = (baseUrl: string, href: string): string => {
  return new URL(href, baseUrl).toString();
};
