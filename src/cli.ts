#!/usr/bin/env node
import { program } from 'commander';
import { z } from 'zod';
import { writeFile } from 'node:fs/promises';
import { normalizeUrl } from './utils/normalizeUrl.js';
import { runConversionLint } from './index.js';
import { createMarkdownReport } from './reports/markdownReport.js';
import { printTerminalReport } from './reports/terminalReport.js';
import { createJsonReport } from './reports/jsonReport.js';

const cliSchema = z.object({
  failUnder: z.number().min(0).max(100).optional(),
  report: z.boolean().optional(),
  json: z.boolean().optional(),
  output: z.string().optional(),
  maxPages: z.number().min(1).max(20).default(1),
});

async function main(): Promise<void> {
  program
    .name('conversionlint')
    .argument('<url>', 'URL to scan')
    .option('--report', 'export markdown report (default path: conversionlint-report.md)')
    .option('--json', 'print JSON report')
    .option('--output <path>', 'write markdown report to custom path')
    .option('--fail-under <score>', 'exit non-zero if score below threshold', (v) => Number(v))
    .option('--max-pages <count>', 'crawl up to N pages on same domain', (v) => Number(v), 1)
    .action(async (rawUrl, options) => {
      try {
        const url = normalizeUrl(rawUrl);
        const parsed = cliSchema.parse(options);
        const result = await runConversionLint(url, parsed.maxPages);

        if (parsed.json) {
          console.log(createJsonReport(result));
        } else {
          printTerminalReport(result, parsed.report || parsed.output ? parsed.output ?? 'conversionlint-report.md' : undefined);
        }

        if (parsed.report || parsed.output) {
          const path = parsed.output ?? 'conversionlint-report.md';
          await writeFile(path, createMarkdownReport(result), 'utf8');
        }

        if (typeof parsed.failUnder === 'number' && result.score < parsed.failUnder) {
          console.error(`Score ${result.score} is below fail-under threshold ${parsed.failUnder}.`);
          process.exitCode = 1;
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown scan error';
        console.error(`ConversionLint failed: ${message}`);
        process.exitCode = 1;
      }
    });

  await program.parseAsync(process.argv);
}

void main();
