# ESG Disclosure Viewer as a Subpage

Repo is public now and was read. It is not a chart dashboard — it's an **ESG Disclosure Profile Viewer**: a single filterable/searchable table of 663 disclosure rows for one (anonymized) company, with CSV export and print. Contents confirmed: `index.html`, `app.js`, `styles.css`, and a generated `data/disclosures.js` (~680 KB, `window.ESG_DATA` with `company`, `updated`, 6 `themes`, and `rows` of `{theme, category, subfactor, keywords[], documents[{label,url}], metrics[{value,label}], highlights}`).

## What you'll get

A public page at `/esg` titled "ESG Profile — Demo Manufacturing Limited", rebuilt natively in this site's design system (whitespace-heavy, teal accent, dark/light aware), linked from the navbar and covered by breadcrumbs.

Feature parity with the original:
- Header: company name, "ESG Profile" subtitle, "Updated <date>" line.
- Filter bar: **Theme** dropdown (6 themes), **Keyword** dropdown whose options and counts recalculate for the selected theme, and a **search box** with a clear button. All three combine (AND).
- Live "showing X of 663 disclosures" count.
- Table with columns: Sub Factor, Keywords, Documents, Highlights — grouped by category with category header rows, matching the original.
- Metrics rendered inside the row as value + label pairs, numbers shown exactly as stored (no rounding or reformatting).
- Documents render as links when a URL exists, plain text when it doesn't.
- Long highlights clamped with a "Show more / Show less" toggle.
- **Download CSV** of the currently visible rows, and **Print / PDF** with a print-friendly layout (unclamped text, repeating header, filter summary line).
- Empty state with a "Clear filters" action.
- Footer note: "Demo — data shown is illustrative."

No onboarding modals, tooltips or help text — the original spec explicitly forbids them.

## Technical details

- Data ships as a static asset `public/data/esg-disclosures.json` (converted from `data/disclosures.js`) and is fetched on page mount, so the 680 KB payload stays out of the main JS bundle. Loading and error states included.
- New files: `src/pages/EsgProfile.tsx`, `src/components/esg/EsgFilterBar.tsx`, `src/components/esg/EsgTable.tsx`, `src/components/esg/EsgRow.tsx`, `src/lib/esg.ts` (types, keyword counts, filter predicate, CSV builder).
- Filtering/derived lists via `useMemo` over the loaded rows; search matches subfactor, category, keywords, metric labels and highlights (case-insensitive), same as the original.
- Uses existing shadcn `Select`, `Input`, `Button`, `Table` primitives and `Layout`/`FadeIn`; colors only from semantic tokens (no hardcoded `text-white`/hex).
- CSV export via a Blob download of visible rows; print via `window.print()` with `print:` Tailwind utilities plus a small `@media print` block in `src/index.css`.
- Route `/esg` added in `src/App.tsx`; `esg: "ESG Profile"` added to `routeLabels` in `src/components/Breadcrumbs.tsx`; "ESG Profile" added to `baseLinks` in `src/components/Navbar.tsx`.
- SEO: single H1, semantic table markup, descriptive page title/meta on the route.
- `roadmap.md` will be created at build time to track this task.

Out of scope: report upload, automatic extraction, the Python converter, `.xlsx`/Word/PDF-library generation.
