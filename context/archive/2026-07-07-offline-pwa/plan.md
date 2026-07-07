# Plan: Offline PWA (S-17)

## Desired end state

After one online visit, the app shell and bundled SRD corpora load offline. Players see an offline banner when disconnected. Installable via web manifest.

## Phase 1: PWA assets and registration

### Changes Required

- `public/manifest.webmanifest` — standalone install metadata
- `public/sw.js` — cache shell, static assets, network-first navigation with offline fallback
- `src/lib/pwa/register.ts` — register helper + tests
- `src/components/ServiceWorkerRegister.tsx` — production registration
- `src/components/OfflineBanner.tsx` — offline status affordance
- `src/app/layout.tsx` — manifest link, viewport theme, PWA components
- `scripts/pwa-guard.test.mjs` — manifest + SW smoke

### Success Criteria

- `npm test`, `npm run typecheck`, `npm run build` pass
- SW caches `/_next/static/` and `/icons/` for offline lookup

## References

- `context/foundation/roadmap.md` — S-17
- `context/foundation/prd.md` — offline after corpus cached

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles.

### Phase 1: PWA assets and registration

#### Automated

- [x] 1.1 Add manifest, service worker, registration, and offline banner
- [x] 1.2 Add PWA guard and registration unit tests
- [x] 1.3 Run full test suite, typecheck, and build
