# DEVLOG — SpendSage

## Day 1 — 2026-05-07

**Hours worked:** 3.5

**What I did:**
Read the brief three times. Mapped out all six MVP features before writing a single line of code. Named the product SpendSage. Set up Next.js 14 with TypeScript and Tailwind. Sketched the audit engine logic on paper.

**What I learned:**
The hardest part of this product is making the audit reasoning defensible. Spent time mapping out what a finance person would accept as legitimate reasoning before touching rule functions.

**Blockers / what I'm stuck on:**
How to handle API-direct tools where spend is variable. Plan: ask for monthly spend manually.

**Plan for tomorrow:**
Build the tool input form, wire up local state with localStorage persistence, and get the audit engine returning real numbers.

## Day 2 — 2026-05-08

**Hours worked:** 5

**What I did:**
Built the full 3-step form flow (Setup → Tools → Audit). Implemented localStorage persistence. Wrote all 8 tool rule functions covering plan-fit logic.

**What I learned:**
GitHub Copilot Business ($19/user) is cheaper than I thought. Had to re-read the pricing page three times to confirm.

**Blockers / what I'm stuck on:**
The seats input for API-direct tools does not make sense — defaulting it to 1 with manual spend entry.

**Plan for tomorrow:**
Build the results page UI — hero savings, per-tool breakdown, action badge colours.

## Day 3 — 2026-05-09

**Hours worked:** 6

**What I did:**
Built the audit results page. Went through four layout iterations. Settled on dark gradient hero card with large savings figure. Added action badge system with colour coding. Integrated Anthropic API for summary generation with graceful fallback.

**What I learned:**
The Anthropic API call fails silently if max_tokens is too low — spent 40 minutes debugging truncated summaries.

**Blockers / what I'm stuck on:**
How prominent to make the Credex CTA. Decided to frame it as capturing savings rather than buying from Credex.

**Plan for tomorrow:**
Backend: Supabase integration for audit storage and lead capture.

## Day 4 — 2026-05-10

**Hours worked:** 5.5

**What I did:**
Set up Supabase project. Created audits and leads tables. Built API routes. Added Resend integration for transactional email. Added basic abuse protection with rate limiting and honeypot field.

**What I learned:**
Supabase row-level security is more powerful than expected. Set up policy so leads table is only readable server-side.

**Blockers / what I'm stuck on:**
Resend sandbox mode only sends to verified addresses.

**Plan for tomorrow:**
Shareable URL and Open Graph tags.

## Day 5 — 2026-05-11

**Hours worked:** 4

**What I did:**
Built the shareable URL system. Each audit gets a UUID stored in Supabase. Added Open Graph and Twitter Card meta tags. Started user interviews — talked to two founders.

**What I learned:**
One interviewee said they would never click a share link for AI spend because it feels like exposing sensitive company data. Changed share copy to explicitly say no company details included.

**Blockers / what I'm stuck on:**
Lighthouse accessibility score below 90 — fixing form label associations.

**Plan for tomorrow:**
Third user interview, write all markdown docs, add CI and tests.

## Day 6 — 2026-05-12

**Hours worked:** 7

**What I did:**
Third user interview. Wrote PRICING_DATA.md — verified every number against official vendor pricing pages. Wrote GTM.md, ECONOMICS.md, LANDING_COPY.md, METRICS.md, REFLECTION.md. Set up GitHub Actions CI. Wrote 7 audit engine unit tests.

**What I learned:**
Writing ECONOMICS.md forced me to actually model the unit economics. Even a 2% conversion from audit to Credex purchase generates meaningful ARR quickly.

**Blockers / what I'm stuck on:**
PDF export bonus feature — ran out of time.

**Plan for tomorrow:**
Final Lighthouse audit, polish, deploy, submit.

## Day 7 — 2026-05-13

**Hours worked:** 4

**What I did:**
Final round of UI polish. Fixed edge case where team of 1 on team plan output negative savings. Ran Lighthouse: Performance 91, Accessibility 94, Best Practices 93. Deployed to Vercel. Verified all six MVP features end-to-end on live URL. Submitted.

**What I learned:**
The gap between working and polished is always larger than expected. The last 10% of polish took 30% of today's time.

**Blockers / what I'm stuck on:**
None — shipped.
