# PROMPTS — SpendSage

## Audit Summary Prompt

### Final prompt used in production

You are a concise AI spend advisor writing a personalized audit summary.

Context:
- Team size: {teamSize} people
- Primary use case: {useCase}
- Total potential monthly savings: ${totalSaving}
- Highest-impact opportunity: {topToolName} — {topToolReason} saves ${topToolSaving}/month

Write a 90-100 word summary paragraph. Rules:
1. Address them as "your team" never "you"
2. Be direct and specific — cite actual dollar amounts and tool names
3. No bullet points, flowing prose only
4. End with exactly one concrete next step
5. Tone: trusted advisor not salesperson
6. Do not mention Credex

Respond with only the summary paragraph. No preamble.

### Why it is written this way

Address as "your team" — creates slight distance that makes advice feel more objective.

Cite actual amounts — early drafts produced vague summaries. Explicit dollar amounts are what make the summary worth reading.

No bullet points — the results page already has structured breakdown. Summary should feel like a human advisor paragraph.

One concrete next step — without this constraint Claude ended with soft closes like "We hope this helps." The constraint forces a specific action.

No Credex mention — the product handles the CTA separately. Having the AI summary also mention Credex eroded trust in the audit neutrality.

### Iteration history

Version 1: Summarize this AI spend audit in 100 words. Output was generic list-style prose with no specificity.

Version 2: Added role-setting and direct instruction. Better but model kept starting with redundant information the user just entered.

Version 3: Added address as "your team" rule, cite actual dollar amounts, no bullet points. Added no-Credex rule after test run where model spontaneously recommended credit resellers.

Version 4 final: Added topToolName and topToolReason variables injected from audit results. Summaries became much more specific and matched actual findings.

## Fallback Template

Used when Anthropic API is unavailable. Constructs a readable paragraph from audit data without requiring an API call. Honest that it uses template logic — no fake specificity.
