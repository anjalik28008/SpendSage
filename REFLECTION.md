# REFLECTION — SpendSage

## 1. Hardest Bug

The most frustrating bug was silent API failure in Anthropic summary generation. Summaries were returning truncated mid-sentence with no error thrown.

My first hypothesis was a network timeout. Added AbortController with 10-second limit. No change.

Second hypothesis: max_tokens too low. I had set it to 150. The prompt consumed most tokens explaining context, and the model was filling the budget and stopping cleanly with no error.

I proved this by printing the raw API response. The stop_reason field said max_tokens not end_turn. Raised max_tokens to 300 and got complete responses every time.

Lesson: always check stop_reason on Anthropic API responses, not just whether the call succeeded.

## 2. A Decision I Reversed

On Day 1 I planned to store pricing data in a Supabase table. By Day 3 I reversed this.

The audit engine logic is tightly coupled to plan IDs and specific price points in the rule functions. Separating pricing into a database would mean async complexity, a potential DB call on every audit, and risk of rules and prices getting out of sync.

A markdown file paired with a static TOOLS constant is simpler, versioned in git, and readable by the team without a database client. The reversal was triggered by writing the first async rule function and realising it was already messy.

## 3. What I Would Build in Week 2

Benchmark mode: your AI spend per developer is X — companies your size average Y.

The audit currently tells you whether your plan selection is right. It does not tell you whether your total level of AI investment is appropriate. Benchmarks answer that question.

Second priority: embeddable widget. A script tag bloggers covering AI productivity could drop in. Every embed is a distribution channel.

Third priority: PDF export. Multiple user interviewees asked for this to share with their CFO.

## 4. How I Used AI Tools

Tools used: Claude (primary code generation), GitHub Copilot (inline completions).

Used AI for: TypeScript type definitions, drafting and iterating on the Anthropic API prompt, writing unit test stubs, checking Supabase RLS policy syntax.

Did not trust AI with: the audit logic itself. Every rule function was written and verified by me against real pricing pages. An LLM generating savings reasoning would embed the bias that more expensive equals bad.

One time AI was wrong: Claude suggested GitHub Copilot Enterprise is $39/user/month without flagging this is the annual billing rate. Monthly billing is higher. I caught this when verifying against the official GitHub pricing page and updated PRICING_DATA.md to specify billing cadence.

## 5. Self Rating

- Discipline: 7/10 — Commits on all 7 days but Day 3 ran long and pushed backend work to Day 4.
- Code quality: 7/10 — TypeScript throughout, clean structure, no obvious bugs. Tool input form got long and needs refactoring.
- Design sense: 8/10 — Results page hero is memorable. Action badge colour system communicates clearly. Mobile layout works.
- Problem solving: 8/10 — Caught the max_tokens bug systematically. Reversed the database decision quickly once evidence said it was wrong.
- Entrepreneurial thinking: 7/10 — GTM is specific with real channels. Economics has actual numbers. User interviews were real and changed the product.
