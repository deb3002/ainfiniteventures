# ESG Dashboard Subpage

Note: `github.com/deb3002/esg-dashboard` is not publicly readable (returns 404 without access), so the exact charts and metrics from that repo could not be inspected. This plan builds a native ESG dashboard page using the standard ESG structure and sample data. If you paste the repo's key screens or make it public, the page can be adjusted to match exactly.

## What you'll get

A public page at `/esg` — "ESG Dashboard" — styled with the existing site design (whitespace-heavy, teal accent, dark/light mode aware), linked from the navbar and reachable via breadcrumbs.

Page sections:
1. Hero: eyebrow label, H1, one-line intro.
2. KPI row: 4 stat cards — Carbon Emissions (tCO2e), Renewable Energy Share, Water Intensity, ESG Score.
3. Environmental: emissions trend line chart (Scope 1/2/3 over 12 months) + energy mix donut chart.
4. Social: bar chart for workforce diversity / training hours / safety incidents.
5. Governance: compact table of governance indicators with status badges.
6. Footer note stating figures are illustrative sample data.

All figures come from a sample data file in the frontend — no database, no auth. Fully responsive, cards reuse existing border/card tokens.

## Technical details

- New `src/pages/EsgDashboard.tsx` wrapped in the existing `Layout`, using `FadeIn` for entrance animation.
- New `src/data/esg.ts` exporting typed sample datasets (KPIs, monthly emissions, energy mix, social metrics, governance rows).
- Charts via `recharts` (already available through the shadcn chart setup) with `src/components/ui/chart.tsx` wrappers; colors from semantic CSS tokens (`--accent`, `--primary`, `--muted`) — no hardcoded hex or `text-white`.
- Route `/esg` added in `src/App.tsx`; `esg` label added to `routeLabels` in `src/components/Breadcrumbs.tsx`; nav entry "ESG Dashboard" added to `baseLinks` in `src/components/Navbar.tsx`.
- SEO: single H1, descriptive section headings, `alt` text where images apply.
