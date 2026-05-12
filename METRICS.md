# METRICS — SpendSage

## North Star Metric

Qualified leads delivered to Credex per week.

Definition: A unique user who completed an audit showing $200 or more per month in potential savings AND submitted their email for follow-up.

Why this and not something else:
- Not audits completed — an audit with zero savings does not help Credex at all
- Not emails captured — a $20 savings audit signup is a low quality lead
- Not DAU — this tool is used once per team per quarter, DAU would be misleadingly low
- Not Credex consultations booked — that is downstream and outside the product control

What working looks like: 20+ qualified leads per week by end of month 2.

## 3 Input Metrics That Drive the North Star

1. Audit Completion Rate
Definition: Audits fully completed divided by users who started the setup form.
Target: 55% or above.
Why it matters: A leaky funnel at the form stage means qualified leads never reach the results page.
How to instrument: Track audit_started event on Setup form load, audit_completed event on results page render.

2. High Savings Audit Rate
Definition: Percentage of completed audits that identify $200 or more per month in savings.
Target: 35-45% of completions.
Why it matters: Only high-savings audits show the Credex CTA and trigger the qualified lead flow.
How to instrument: Log savings amount on every audit save. Histogram by savings bucket.

3. Email Capture Rate on High Savings Audits
Definition: Percentage of users who see the $200+ savings CTA and submit their email.
Target: 20-30%.
Why it matters: This is the final conversion step. Low rates mean the CTA copy is not compelling or users do not trust the tool.
How to instrument: Track cta_shown and email_submitted events.

## What to Instrument First

1. Funnel events: page_view, setup_started, tools_step_reached, audit_completed, cta_shown, email_submitted, share_link_copied
2. Audit quality events: savings amount bucketed, number of tools entered, use case selected, team size bucket
3. Error events: api_summary_failed, audit_save_failed, email_capture_failed
4. Sharing events: share_url_generated, og_preview_loaded via referrer tracking

Tool recommendation: PostHog over Mixpanel — better funnel visualisation, GDPR-friendly, can self-host.

## What Number Triggers a Pivot Decision

Trigger: Qualified leads per week below 5 after 6 weeks of active distribution.

Diagnosis protocol:
1. Check audit completion rate first. Below 40% means form problem.
2. If completion rate is fine but high savings rate is below 20% means engine calibration or wrong audience problem.
3. If high savings rate is fine but email capture is below 15% means CTA or trust problem.
4. If all funnel metrics are fine but leads are low in absolute terms means pure distribution problem.

The metric that would trigger killing the product: 8 weeks of active distribution with fewer than 2 qualified leads per week and no improving trend.
