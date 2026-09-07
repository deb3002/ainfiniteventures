# Bring the updated ESG viewer changes into /esg

The repo now has a second commit ("Add framework mapping, trend charts and framework grouping"). The data file grew from 680 KB to 846 KB and the viewer gained three real features. The `/esg` page here still reflects the first version, so it needs updating.

## What changed upstream

- **Framework mapping**: 149 of the 663 rows now carry framework tags (BRSR, BRSR Core, GRI, IFC) with indicator codes shown on the page — e.g. `BRSR  A1 · Section A`, `GRI  2, 3, 201, 401, 405`. IFC tags are marked provisional (unverified) and styled differently.
- **Trend charts**: 40 rows now carry year-over-year series; 5 series are flagged where the reporting basis appears to have changed, with an explanatory note.
- **Framework grouping**: selecting IFC regroups the whole table under Performance Standards PS1–PS8 (with full names) instead of the spreadsheet's categories.
- Group headers now show a short code chip (P1, A, B / PS 1…) and a per-group disclosure tally.
- Keyword dropdown is now sorted alphabetically (was by count).
- CSV export gained a Frameworks column with unabbreviated codes.
- Footer note reworded.

## What you'll get on /esg

1. **Framework filter** next to Theme and Keyword — options `All Frameworks`, `BRSR (n)`, `BRSR Core (n)`, `GRI (n)`, `IFC (n)`, counts computed from the data. Combines with the other filters.
2. **Framework tags in the Keywords column**, above the keyword chips, each showing its reference numbers next to it. Provisional (IFC) tags rendered in a muted/outlined style so they read as unverified. Keyword chips that duplicate a framework name are hidden from view but still drive filters, search and export.
3. **Trend charts** in the Highlights column: small column charts drawn as SVG with a zero baseline, one column per year, exact values printed underneath. Series with fewer than three years render as a single sentence ("14,629,136.19 in 2026, up from 1,072,290.39 in 2024") instead of a chart. Flagged series get a dashed break line and their note shown below.
4. **IFC regrouping**: choosing IFC reorders the table under PS1–PS8 headings using the Performance Standard names, with unmapped rows in a trailing group.
5. **Group headers** with code chip, name and disclosure count.
6. Keyword dropdown sorted A–Z; CSV export includes the Frameworks column; footer note updated to the new wording.

Behaviour kept as-is: theme/keyword/search filtering, live "showing X of 663" count, show more/less on long highlights, Download CSV of visible rows, Print / PDF, empty state with Clear filters.

## Technical details

- Regenerate `public/data/esg-disclosures.json` from the new `data/disclosures.js` (now includes `ifcNames`, and per-row `frameworks`, `series`, `standalone`).
- `src/lib/esg.ts`: add `EsgFramework`, `EsgSeries`, `EsgSeriesPoint` types plus `ifcNames`; add `ALL_FRAMEWORKS`, `frameworkCounts()`, `hasFramework()`, framework arg in `rowMatches`, IFC grouping helpers (`groupKey`, `groupLabel`, `shortCode`, `IFC_ORDER`), and the Frameworks column in `buildCsv`. Keyword sort switched to alphabetical.
- `EsgFilterBar.tsx`: add the Framework `Select`.
- `EsgTable.tsx`: grouping driven by the selected framework rather than always by category; new group header row with chip + count.
- `EsgRow.tsx`: framework tag list, and figures block that renders series charts before standalone metrics.
- New `src/components/esg/EsgSeriesChart.tsx`: dependency-free SVG columns, zero baseline, `role="img"` with a text label listing year/value pairs, break line and note for flagged series, colors from semantic tokens only.
- Verify in the browser after the build: framework counts appear, IFC regroups to PS headings, a flagged chart (GHG Emission) renders with its note, CSV includes frameworks.
