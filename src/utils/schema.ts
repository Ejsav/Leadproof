export const extractSchemaTypes = (schemas: Array<{ type: string }>): string[] =>
  schemas.map((schema) => schema.type.toLowerCase());
