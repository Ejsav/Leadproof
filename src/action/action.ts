import * as core from '@actions/core';
import { writeFile } from 'node:fs/promises';
import { normalizeUrl } from '../utils/normalizeUrl.js';
import { runConversionLint } from '../index.js';
import { createMarkdownReport } from '../reports/markdownReport.js';

async function run(): Promise<void> {
  try {
    const rawUrl = core.getInput('url', { required: true });
    const failUnder = Number(core.getInput('fail-under') || '0');
    const maxPages = Number(core.getInput('max-pages') || '1');
    const output = core.getInput('output') || '';

    const result = await runConversionLint(normalizeUrl(rawUrl), maxPages);
    core.info(`ConversionLint score: ${result.score}/100`);

    const markdown = createMarkdownReport(result);
    if (output) {
      await writeFile(output, markdown, 'utf8');
      core.info(`Report saved to ${output}`);
    } else {
      core.info(markdown);
    }

    if (failUnder > 0 && result.score < failUnder) {
      core.setFailed(`Score ${result.score} is below fail-under threshold ${failUnder}`);
    }
  } catch (error) {
    core.setFailed(error instanceof Error ? error.message : 'Unknown action error');
  }
}

void run();
