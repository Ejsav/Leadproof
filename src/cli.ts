#!/usr/bin/env node
import { Command } from 'commander';
import fs from 'node:fs/promises';
import { normalizeUrl } from './utils/normalizeUrl.js';
import { scanUrl } from './scanner/scanUrl.js';
import { renderTerminalReport } from './reports/terminalReport.js';
import { createMarkdownReport } from './reports/markdownReport.js';
import { createJsonReport } from './reports/jsonReport.js';

const program = new Command();

program
  .name('conversionlint')
  .description('Conversion quality linter for websites that are supposed to convert.')
  .argument('<url>', 'URL to scan')
  .option('--report', 'Write markdown report to default path', false)
  .option('--json', 'Print JSON report', false)
  .option('--fail-under <score>', 'Exit non-zero if score is below threshold', '0')
  .option('--output <path>', 'Markdown report output path')
  .option('--max-pages <count>', 'Max same-domain pages to inspect', '1')
  .action(async (urlArg, options) => {
    try {
      const url = normalizeUrl(urlArg);
      const failUnder = Number(options.failUnder ?? 0);
      const maxPages = Math.max(1, Number(options.maxPages ?? 1));
      const result = await scanUrl(url, maxPages);
      const outputPath = options.output ?? 'conversionlint-report.md';

      if (options.json) {
        console.log(createJsonReport(result));
      } else {
        console.log(renderTerminalReport(result, options.report || options.output ? outputPath : undefined));
      }

      if (options.report || options.output) {
        const markdown = createMarkdownReport(result);
        await fs.writeFile(outputPath, markdown, 'utf8');
      }

      if (result.score < failUnder) {
        console.error(
          `ConversionLint score ${result.score} is below fail-under threshold ${failUnder}.`,
        );
        process.exitCode = 1;
      }
    } catch (error) {
      console.error(
        error instanceof Error
          ? `ConversionLint failed: ${error.message}`
          : 'ConversionLint failed: unknown error',
      );
      process.exitCode = 1;
    }
  });

program.parseAsync(process.argv);
