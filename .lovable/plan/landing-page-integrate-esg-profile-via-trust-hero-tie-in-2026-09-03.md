# Landing Page: Integrate ESG Profile via Trust & Hero Tie-in

## Goal
Now that the `/esg` ESG Disclosure Profile Viewer exists, weave it into the landing page's credibility narrative rather than adding a third division card. The two-pillar "divisions" grid (Labs + Consulting) stays; ESG enters through the hero copy and the trust section.

## Changes (all in `src/pages/Index.tsx`)

### 1. Broaden the hero copy
- Eyebrow: keep "Ainfinite Ventures LLP".
- Headline: keep "Shaping the future of artificial intelligence" (still accurate and strong).
- Subcopy: rewrite to mention the three threads — AI products, enterprise consulting, and ESG transparency — under one roof. E.g.:
  > "We build transformative AI products, deliver enterprise-grade AI solutions, and bring transparency to sustainability through our ESG disclosure work — all under one roof."

### 2. Weave ESG into the Trust section (no new card)
The current Trust section is a single full-width band: "Intelligence. Integrity. Impact." Enhance it to surface ESG as a credibility/commitment link:
- Add a short line below the existing paragraph framing ESG transparency as part of how the company earns trust.
- Add a clear secondary CTA linking to `/esg` (e.g. "Explore our ESG Disclosure Profile" with an arrow), styled as a subtle text link inside the band — consistent with the accent-on-primary treatment, no new component needed.
- Keep "Intelligence. Integrity. Impact." as the headline; do not restructure the section.

### 3. Keep the two-division grid unchanged
- Labs and Consulting cards stay exactly as they are. ESG is deliberately not a third card, per the trust-tie-in direction.

## Technical notes
- Single-file edit to `src/pages/Index.tsx`; no new components, no routing changes, no DB changes.
- Reuse existing tokens (`text-accent`, `bg-primary`, `text-primary-foreground`), `FadeIn`, and `Link` from `react-router-dom`.
- No changes to Navbar (ESG Profile link already there) or Breadcrumbs.

## Verification
- Open `/` in the preview: hero subcopy mentions ESG; trust band shows the new ESG line and a working `/esg` link.
- Confirm the two division cards are unchanged.
- Check both light and night mode for contrast on the trust band link.
