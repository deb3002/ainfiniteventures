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
- The workbook contains no company values or reviewed evidence links. Imported
  indicators therefore display **No evidence linked**. Existing illustrative
  company values are not copied or inferred from shared GRI/BRSR codes.
- Questionnaire year, industry and applicability remain unspecified/unconfirmed.
  CSA future-question topics are retained as supplied and are not presented as
  current mandatory requirements.
- Numeric Excel references require review: a stored `1.1` cannot distinguish an
  original `1.1` from `1.10`. Do not repair these codes by guessing.
- Before adding reviewed evidence, confirm questionnaire version and applicability,
  assign stable IDs to the relevant company disclosure records, and maintain a
  separate many-to-many evidence-link dataset with review status and coverage.
  Partial and contextual alignment must not be treated as complete responses.
  No official scores or completion percentages are calculated in this release.

## Filtering and exports

CDP is available in both Reporting & disclosure and Ratings & assessments; CSA
is in Ratings & assessments. IFC remains under Performance standards. Selecting
a type resets an incompatible framework and changing framework/type resets the
topic keyword. All other active filters combine with AND semantics. Clear filters
restores the complete set.

Framework counts count each matching row once per framework and respect the other
filters. CDP groups by module and CSA by topic. CSV exports the visible records,
including reference-review flags, provenance, alignment and missing-evidence status.
Print includes active filters and the same visible table. Catalogue records remain
visible when no evidence is linked.
