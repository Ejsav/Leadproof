import * as core from '@actions/core';
import { z } from 'zod';
import { normalizeUrl } from '../utils/normalizeUrl.js';
import { scanUrl } from '../scanner/scanUrl.js';
import { createMarkdownReport } from '../reports/markdownReport.js';
import fs from 'node:fs/promises';

const inputSchema = z.object({
  url: z.string().min(1),
  failUnder: z.coerce.number().min(0).max(100).default(0),
  maxPages: z.coerce.number().min(1).max(20).default(5),
  output: z.string().default('conversionlint-report.md'),
});

export const runAction = async (): Promise<void> => {
  try {
    const parsed = inputSchema.parse({
      url: core.getInput('url', { required: true }),
      failUnder: core.getInput('fail-under') || '0',
      maxPages: core.getInput('max-pages') || '5',
      output: core.getInput('output') || 'conversionlint-report.md',
    });

    const result = await scanUrl(normalizeUrl(parsed.url), parsed.maxPages);
    const markdown = createMarkdownReport(result);
    await fs.writeFile(parsed.output, markdown, 'utf8');

    core.info(`ConversionLint score: ${result.score}/100`);
    core.setOutput('score', result.score.toString());
    core.setOutput('report-path', parsed.output);

    if (result.score < parsed.failUnder) {
      core.setFailed(
        `ConversionLint score ${result.score} is below fail-under ${parsed.failUnder}.`,
      );
    }
  } catch (error) {
    core.setFailed(error instanceof Error ? error.message : 'Unknown action failure');
  }
};

if (process.env.GITHUB_ACTIONS) {
  runAction();
}
