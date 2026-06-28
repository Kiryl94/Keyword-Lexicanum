---
starter_id: next
package_manager: npm
project_name: keyword-lexicanum
hints:
  language_family: js
  team_size: solo
  deployment_target: vercel
  ci_provider: github-actions
  ci_default_flow: auto-deploy-on-merge
  bootstrapper_confidence: first-class
  path_taken: standard
  quality_override: false
  self_check_answers: null
  has_auth: false
  has_payments: false
  has_realtime: false
  has_ai: false
  has_background_jobs: false
---

## Why this stack

Pivot from mobile to web-first MVP: a solo after-hours builder needs a responsive lookup app usable at the table in a phone browser, without native app store friction. Next.js is the mainstream `(web, js)` choice with strong agent-friendly gates and first-class bootstrapper support. It fits keyword search UI, client-side session state, and later offline corpus caching (IndexedDB / service worker) without forcing Supabase or auth the PRD excludes. Vercel deploy matches the solo GitHub Actions flow. Native mobile remains a long-term option; v1 ships as web.
