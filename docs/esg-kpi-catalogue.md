# CDP and CSA KPI catalogue

The ESG page combines the existing illustrative company disclosures with 116 CDP
and 292 CSA indicator records from the supplied `KPIs.xlsx`. These counts describe
the supplied workbook, not complete official questionnaire coverage.

## Updating the catalogue

Install Python's `openpyxl` package, then run:

```sh
python scripts/import-esg-kpis.py /path/to/KPIs.xlsx
npm test
npm run build
```

The workbook stays outside the repository. The generated
`public/data/esg-kpis.json` is committed and loaded independently of
`esg-disclosures.json`. An unavailable or invalid catalogue shows a visible error
without preventing users from browsing existing disclosures. Importing does not
change any existing company values or framework mappings.

IDs derive from framework, topic and indicator text, so reordering workbook rows
does not change identities. Renaming an indicator intentionally creates a new ID;
review downstream references when updating the workbook. Blank sheets are ignored.
Each record retains its source file, sheet and Excel row, plus the original CDP
question-reference value. Themes are broad editorial topic classifications in the
import script, not official framework classifications.

## Mapping and evidence rules

- The GRI and BRSR crosswalks retain their original reference, title, section,
  principle and alignment. Every imported crosswalk is provisional. A `Direct`
  alignment in the workbook does not mark company evidence as verified.
- Crosswalks are displayed separately and searchable. They do not make a CDP/CSA
  indicator a native GRI/BRSR company disclosure, so existing framework filters
  preserve their original results.
- `src/lib/esg-evidence.ts` joins workbook GRI disclosure references to existing
  GRI-tagged company disclosures. Subclauses (305-1-a), ranges (303-1 to 303-5)
  and slash lists (302-1/3/4) normalize to disclosure IDs. Duplicate matches to
  the same source row are shown once, retaining every matching reference.
- Matching indicators display the source disclosure's unchanged highlights,
  metrics, series, reporting periods and documents with the workbook's Direct,
  Partial or Contextual alignment. Values remain attached to their source
  disclosure; the app does not extract or infer a new KPI value.
- Explicit broad references such as `GRI 305 series` retrieve related disclosures
  as Contextual information. Generic source tags such as `GRI 305` do not prove
  a specific disclosure match. Missing/no-direct references remain unmatched.
- BRSR crosswalks remain visible but are not used as numerical join keys: the
  workbook and existing source use different question numbers for some topics
  (for example emissions). GRI provides the shared reference bridge. Indicators
  without a resolvable GRI match show **No matching disclosure found**; this does
  not establish that the company lacks the information.
- For the current supplied data, 81 CDP and 222 CSA indicators have matches;
  35 CDP and 70 CSA indicators remain unmatched. These are reference-match counts,
  not assessment completion or compliance counts.
- Questionnaire year, industry and applicability remain unspecified/unconfirmed.
  CSA future-question topics are retained as supplied and are not presented as
  current mandatory requirements.
- Numeric Excel references require review: a stored `1.1` cannot distinguish an
  original `1.1` from `1.10`. Do not repair these codes by guessing.
- Links are derived from the supplied crosswalk, not independently verified
  questionnaire answers. Confirm version, applicability and the underlying
  source mapping before claiming full coverage. No official scores or completion
  percentages are calculated.

## Filtering and exports

CDP is available in both Reporting & disclosure and Ratings & assessments; CSA
is in Ratings & assessments. IFC remains under Performance standards. Selecting
a type resets an incompatible framework and changing framework/type resets the
topic keyword. All other active filters combine with AND semantics. Clear filters
restores the complete set.

Framework counts count each matching row once per framework and respect the other
filters. CDP groups by module and CSA by topic. CSV exports the visible records,
including reference-review flags, provenance, alignment and evidence status. The
Linked Company Evidence column preserves each matched disclosure and its values,
series, source frameworks and documents as JSON, without merging their units or periods.
Print includes active filters and the same visible table. Catalogue records remain
visible when no evidence is linked.
