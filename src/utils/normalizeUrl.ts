export const normalizeUrl = (input: string): string => {
  try {
    const url = new URL(input.startsWith('http') ? input : `https://${input}`);
    url.hash = '';
    return url.toString();
  } catch {
    throw new Error(`Invalid URL provided: ${input}`);
  }
};
