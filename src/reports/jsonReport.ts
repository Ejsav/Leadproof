import type { ScanResult } from '../engine/ruleTypes.js';

export const createJsonReport = (result: ScanResult): string =>
  JSON.stringify(result, null, 2);
