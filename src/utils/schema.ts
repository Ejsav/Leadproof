export function parseSchemaTypesFromJsonLd(jsonLdBlocks: string[]): string[] {
  const types = new Set<string>();

  for (const block of jsonLdBlocks) {
    try {
      const parsed = JSON.parse(block);
      collectTypes(parsed, types);
    } catch {
      // Ignore malformed schema block.
    }
  }

  return Array.from(types);
}

function collectTypes(node: unknown, out: Set<string>): void {
  if (!node || typeof node !== 'object') return;

  if (Array.isArray(node)) {
    node.forEach((item) => collectTypes(item, out));
    return;
  }

  const maybeType = (node as { ['@type']?: string | string[] })['@type'];
  if (typeof maybeType === 'string') out.add(maybeType);
  if (Array.isArray(maybeType)) maybeType.forEach((type) => out.add(type));

  Object.values(node as Record<string, unknown>).forEach((value) => collectTypes(value, out));
}
