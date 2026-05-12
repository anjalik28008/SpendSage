# TESTS — SpendSage

Run all tests:
npm test

Run with coverage:
npx vitest run --coverage

## Audit Engine Tests

File: src/__tests__/auditEngine.test.ts

Test 1: Solo user on team plan gets downgrade recommendation
Covers: chatgpt rule — Team plan for 1 user should flag downgrade to Plus
How to run: npx vitest run --reporter=verbose src/__tests__/auditEngine.test.ts

Test 2: Optimal plan returns no savings
Covers: A correctly sized plan should return action optimal and saving 0
How to run: npx vitest run --reporter=verbose src/__tests__/auditEngine.test.ts

Test 3: Enterprise plan for small team flags downgrade
Covers: cursor rule — Enterprise for 5 or fewer users should suggest Business tier
How to run: npx vitest run --reporter=verbose src/__tests__/auditEngine.test.ts

Test 4: Non-coding tool used for non-coding gets reconsider flag
Covers: cursor use-case rule — Cursor on a writing team should flag reconsideration
How to run: npx vitest run --reporter=verbose src/__tests__/auditEngine.test.ts

Test 5: Total savings aggregates correctly across multiple tools
Covers: totalSaving aggregation — sum of individual tool savings matches total
How to run: npx vitest run --reporter=verbose src/__tests__/auditEngine.test.ts

Test 6: Disabled tools are excluded from audit
Covers: entries with enabled false should not appear in results
How to run: npx vitest run --reporter=verbose src/__tests__/auditEngine.test.ts

Test 7: Claude Max 20x for small team flags downgrade to Max 5x
Covers: claude rule — Max 20x for 2 or fewer users should suggest Max 5x
How to run: npx vitest run --reporter=verbose src/__tests__/auditEngine.test.ts

Test 8: GitHub Copilot Business for solo user flags downgrade to Individual
Covers: github_copilot coding rule — Business plan for 1 user vs Individual
How to run: npx vitest run --reporter=verbose src/__tests__/auditEngine.test.ts

## API Route Tests

File: src/__tests__/api.test.ts

Test 9: Lead capture rejects missing email
Covers: /api/leads/capture returns 400 if email field is absent
How to run: npx vitest run --reporter=verbose src/__tests__/api.test.ts

Test 10: Audit save returns shareId
Covers: /api/audit/save persists and returns a valid shareId
How to run: npx vitest run --reporter=verbose src/__tests__/api.test.ts

## Running in CI

Tests run automatically on every push to main via .github/workflows/ci.yml
