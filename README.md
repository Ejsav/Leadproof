# ConversionLint

ConversionLint is an open-source conversion quality scanner for websites that are supposed to convert.

Most websites are tested for speed, accessibility, and SEO. Almost none are tested for persuasion, trust, and lead flow.

ConversionLint scans a page for conversion-critical issues like missing CTAs, weak metadata, broken phone links, missing trust sections, poor local SEO structure, incomplete schema, buried contact paths, and conversion regressions.

## Tagline

**Most websites are tested for performance. Almost none are tested for persuasion.**

## Why this exists

ConversionLint helps teams answer one question quickly: **is this website built to convert?**

It is intentionally deterministic (no paid AI APIs) and built as an extensible TypeScript rule engine.

## Install

```bash
npm install -g conversionlint
```

Or run directly:

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

- `--report` Export markdown report (`conversionlint-report.md` default)
- `--output <path>` Export markdown report to custom path
- `--json` Print JSON report
- `--fail-under <score>` Exit with non-zero status if score is below threshold
- `--max-pages <count>` Crawl same-domain pages up to limit

## Example output

```text
ConversionLint Score: 86/100

Strong:
✓ Primary CTA visible above the fold
✓ Phone CTA detected
✓ LocalBusiness schema found

High Priority Issues:
✕ No trust section detected near the hero
✕ Open Graph image missing
```

## Rule categories

1. Above-the-Fold Conversion (25)
2. Lead Flow (20)
3. Trust Signals (20)
4. Local SEO (15)
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

Action inputs:
- `url`
- `fail-under`
- `max-pages`
- `output`

## Roadmap

- v0.2: richer multi-page crawl graph and broken-link tracing
- v0.2: confidence scoring per rule
- v0.2: rule presets for local services, SaaS, and e-commerce
- v0.2: GitHub PR comment summaries (TODO)

## Contributing

PRs and rule proposals are welcome. Keep rules deterministic and evidence-based.

## Portfolio context

Built for Eric Jokl’s portfolio positioning:

**Digital Builder | Full-Stack Developer | UX & Conversion Systems**

## License

MIT
