# ConversionLint

ConversionLint is an open-source conversion quality scanner for websites that are supposed to convert.

Most websites are tested for speed, accessibility, and SEO. Almost none are tested for persuasion, trust, and lead flow.

ConversionLint scans a page for conversion-critical issues like missing CTAs, weak metadata, broken phone links, missing trust sections, poor local SEO structure, incomplete schema, buried contact paths, and conversion regressions.

## Why this exists

Web teams can run Lighthouse, accessibility checks, and SEO audits every day—but conversion quality is still mostly manual. ConversionLint brings deterministic, repeatable conversion checks into engineering workflows and CI.

Tagline: **Most websites are tested for performance. Almost none are tested for persuasion.**

Positioning: **ESLint for websites that need to convert.**

Created for Eric Jokl’s portfolio positioning:

**Digital Builder | Full-Stack Developer | UX & Conversion Systems**

## What it does

- Scans a URL (and optional internal pages) using fetch + deterministic analysis.
- Uses HTML parsing, metadata checks, schema extraction, and rendered CTA visibility checks.
- Runs conversion-focused rules across seven categories.
- Produces an explainable score from 0 to 100.
- Exports terminal, markdown, and JSON reports.
- Supports CI with `--fail-under`.

## Install

```bash
npm install
npm run build
```

Run as local CLI:

```bash
npm run scan -- https://example.com
```

Published usage target:

```bash
npx conversionlint https://example.com
```

## Usage

```bash
conversionlint https://example.com
conversionlint https://example.com --report
conversionlint https://example.com --json
conversionlint https://example.com --fail-under 80
conversionlint https://example.com --output conversionlint-report.md
conversionlint https://example.com --max-pages 5
```

## CLI options

- `--report` export markdown report (default path `conversionlint-report.md`)
- `--json` print JSON result
- `--output <path>` set markdown output file path
- `--fail-under <score>` fail process when score is below threshold
- `--max-pages <count>` crawl and inspect up to N same-domain pages

## Example output

```txt
ConversionLint Score: 86/100

Strong:
✓ Primary CTA visible above the fold
✓ Phone CTA detected
✓ LocalBusiness schema found
✓ Contact path detected
✓ Open Graph metadata found

Issues:
✕ No trust section detected near the hero
✕ Form submit button uses generic language
✕ Open Graph image missing
✕ CTA language changes across key sections
```

## Rule categories

1. Above-the-Fold Conversion (25)
2. Lead Flow (20)
3. Trust Signals (20)
4. Local SEO Structure (15)
5. Metadata (10)
6. Technical Basics (5)
7. Conversion Consistency (5)

## GitHub Action

```yaml
name: ConversionLint

on:
  pull_request:

jobs:
  conversionlint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ericjokl/conversionlint@v1
        with:
          url: "https://example.com"
          fail-under: 80
```

Inputs:

- `url`
- `fail-under`
- `max-pages`
- `output`

Current action behavior:

- Runs the scanner
- Prints score
- Fails when below `fail-under`
- Writes markdown report

TODO (v0.2): optional pull request comment publishing.

## Scripts

- `npm run build`
- `npm run dev`
- `npm run test`
- `npm run lint`
- `npm run format`
- `npm run scan -- <url>`

## Contributing

Contributions are welcome. Please open issues for rule ideas, false positives, and category tuning proposals.

## Roadmap

- v0.2 configurable rules and project config file
- v0.2 PR comment summarization in GitHub Actions
- v0.3 richer multi-page flow checks and regression baseline support

## License

MIT (see `LICENSE`).
