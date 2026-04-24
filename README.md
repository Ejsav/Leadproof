# LeadProof MVP

LeadProof is a production-ready MVP for auditing local service business websites and generating lead-generation scorecards plus outreach copy.

## Stack
- Next.js App Router + TypeScript
- Tailwind CSS + lightweight shadcn-style UI components
- Supabase for saved audits
- OpenAI API for generated analysis
- Vercel-ready setup

## Features
- Landing page
- Dashboard
- New Audit flow
- Audit Results page
- Saved Audits page
- Scores (1–10): first impression, mobile conversion, CTA clarity, trust signals, SEO/local relevance, lead capture, revenue potential
- Generated outputs:
  - Plain-English summary
  - Top 5 issues
  - Top 5 fixes
  - Cold email
  - Cold SMS
  - Website rebuild pitch
- Supabase persistence with graceful fallback when keys are missing
- Mock analysis when OpenAI key is missing

## Quick Start
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy env file:
   ```bash
   cp .env.example .env.local
   ```
3. Run development server:
   ```bash
   npm run dev
   ```
4. Open http://localhost:3000

## Environment variables
See `.env.example`.

## Supabase setup
Create table `audits` with a JSON-friendly schema. Example SQL:

```sql
create table if not exists audits (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  businessName text not null,
  websiteUrl text not null,
  industry text not null,
  city text not null,
  notes text,
  summary text not null,
  topIssues text[] not null,
  topFixes text[] not null,
  coldEmail text not null,
  coldSms text not null,
  rebuildPitch text not null,
  scores jsonb not null
);
```

## Deployment (Vercel)
- Import repo in Vercel
- Add env vars from `.env.example`
- Build command: `npm run build`
- Output: default Next.js

## Notes
- If `OPENAI_API_KEY` is missing, app returns realistic seeded dummy audits.
- If Supabase env vars are missing, app still works and saves latest result to localStorage for viewing on Results page.
