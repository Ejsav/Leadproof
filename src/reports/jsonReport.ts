import type { ScanResult } from '../engine/ruleTypes.js';

export function createJsonReport(result: ScanResult): string {
  return JSON.stringify(result, null, 2);
}
