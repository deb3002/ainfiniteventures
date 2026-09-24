export interface EsgDocument {
  label: string;
  url: string | null;
}

export interface EsgMetric {
  value: number | string;
  label: string;
}

export interface EsgFramework {
  name: string;
  detail?: string;
  full?: string;
  indicator?: string;
  level?: string;
  verified?: boolean;
  source?: string;
}

export interface EsgSeriesPoint {
  year: string;
  value: number;
}

export interface EsgSeries {
  measure: string;
  unit?: string;
  points: EsgSeriesPoint[];
  flagged?: boolean;
  breaks?: number[];
  note?: string;
}

export interface EsgRowData {
  id?: string;
  kpi?: EsgKpi;
  theme: string;
  category: string;
  subfactor: string;
  keywords: string[];
  documents: EsgDocument[];
  metrics: EsgMetric[];
  frameworks?: EsgFramework[];
  series?: EsgSeries[];
  standalone?: EsgMetric[];
  highlights: string;
}

export interface EsgData {
  company: string;
  updated: string;
  themes: string[];
  ifcNames?: Record<string, string>;
  rows: EsgRowData[];
}

export const ALL_THEMES = "All Themes";
export const ALL_KEYWORDS = "All Keywords";
export const ALL_FRAMEWORKS = "All Frameworks";
export const ALL_FRAMEWORK_TYPES = "All framework types";
export const FRAMEWORK_TYPES = ["Reporting & disclosure", "Ratings & assessments", "Performance standards"];
export const FRAMEWORK_ORDER = ["BRSR", "BRSR Core", "GRI", "CDP", "CSA", "IFC"];
export const FRAMEWORK_TYPE_MAP: Record<string, string[]> = {
  BRSR: [FRAMEWORK_TYPES[0]],
  "BRSR Core": [FRAMEWORK_TYPES[0]],
  GRI: [FRAMEWORK_TYPES[0]],
  CDP: [FRAMEWORK_TYPES[0], FRAMEWORK_TYPES[1]],
  CSA: [FRAMEWORK_TYPES[1]],
  IFC: [FRAMEWORK_TYPES[2]],
};

export interface KpiMapping {
  framework: "GRI" | "BRSR";
  reference: string | null;
  title?: string | null;
  section?: string | null;
  principle?: string | null;
  alignment: string | null;
  reviewStatus: "provisional";
}

export interface EsgKpi {
  id: string;
  framework: "CDP" | "CSA";
  topic: string;
  indicator: string;
  theme: string;
  questionReference: string | null;
  referenceNeedsReview: boolean;
  version: string | null;
  industry: string | null;
  applicability: "unconfirmed";
  source: { file: string; sheet: string; row: number; originalReference: string | number | null };
  mappings: KpiMapping[];
}

export function frameworkMatchesType(framework: string, type: string) {
  return type === ALL_FRAMEWORK_TYPES || (FRAMEWORK_TYPE_MAP[framework] ?? []).includes(type);
}

export function kpiToRow(kpi: EsgKpi): EsgRowData {
  return {
    id: kpi.id,
    kpi,
    theme: kpi.theme,
    category: `${kpi.framework} · ${kpi.topic}`,
    subfactor: kpi.indicator,
    keywords: [kpi.topic],
    documents: [],
    metrics: [],
    // Crosswalk references are not native GRI/BRSR disclosures or evidence.
    frameworks: [{ name: kpi.framework, detail: kpi.questionReference ?? undefined, verified: false }],
    highlights: "No evidence linked. Company data has not been assessed against this indicator.",
  };
}
export const IFC_ORDER = ["PS1", "PS2", "PS3", "PS4", "PS5", "PS6", "PS7", "PS8"];

/** Group digits without rounding or altering the stored value. */
export function formatMetricValue(value: number | string) {
  const str = String(value);
  const [intPart, ...rest] = str.split(".");
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return rest.length > 0 ? `${grouped}.${rest.join(".")}` : grouped;
}

export function hasFramework(row: EsgRowData, name: string) {
  return (row.frameworks ?? []).some((f) => f.name === name);
}

export function frameworkCounts(rows: EsgRowData[]) {
  const counts: Record<string, number> = {};
  rows.forEach((row) => {
    new Set((row.frameworks ?? []).map((f) => f.name)).forEach((name) => {
      counts[name] = (counts[name] || 0) + 1;
    });
  });
  return counts;
}

export function rowMatches(
  row: EsgRowData,
  theme: string,
  keyword: string,
  query: string,
  framework: string = ALL_FRAMEWORKS,
  frameworkType: string = ALL_FRAMEWORK_TYPES,
) {
  if (theme !== ALL_THEMES && row.theme !== theme) return false;
  if (keyword !== ALL_KEYWORDS && !row.keywords.includes(keyword)) return false;
  if (framework !== ALL_FRAMEWORKS && !hasFramework(row, framework)) return false;
  // Apply both constraints to the same framework, not unrelated tags on a row.
  if (frameworkType !== ALL_FRAMEWORK_TYPES && !(row.frameworks ?? []).some(
    (f) => (framework === ALL_FRAMEWORKS || f.name === framework) && frameworkMatchesType(f.name, frameworkType),
  )) return false;
  query = query.trim().toLowerCase();
  if (query === "") return true;

  const haystack = [
    row.subfactor,
    row.category,
    row.keywords.join(" "),
    row.metrics.map((m) => m.label).join(" "),
    row.highlights,
    (row.frameworks ?? []).map((f) => [f.name, f.detail, f.full, f.indicator].filter(Boolean).join(" ")).join(" "),
    row.kpi?.id,
    row.kpi?.questionReference,
    row.kpi?.mappings.map((m) => [m.framework, m.reference, m.title, m.section, m.principle, m.alignment].filter(Boolean).join(" ")).join(" "),
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
}

export function keywordCountsForTheme(rows: EsgRowData[], theme: string) {
  const counts: Record<string, number> = {};
  rows.forEach((row) => {
    if (theme !== ALL_THEMES && row.theme !== theme) return;
    row.keywords.forEach((kw) => {
      counts[kw] = (counts[kw] || 0) + 1;
    });
  });
  return counts;
}

export function sortedKeywords(counts: Record<string, number>) {
  return Object.keys(counts).sort((a, b) => a.localeCompare(b));
}

/** Short code chip for a spreadsheet category ("Principle 3" -> "P3"). */
export function shortCode(category: string) {
  let m = /Principle (\d+)/.exec(category);
  if (m) return `P${m[1]}`;
  m = /Section ([AB])/.exec(category);
  if (m) return m[1];
  return "";
}

/** Which heading a row sits under, for the framework currently chosen. */
export function groupKey(row: EsgRowData, framework: string) {
  if (row.kpi) return `${row.kpi.framework} · ${row.kpi.topic}`;
  if (framework === "IFC") {
    const f = (row.frameworks ?? []).find((x) => x.name === "IFC");
    return f?.full ? f.full.split(", ")[0] : "PS-none";
  }
  return row.category;
}

export function groupLabel(
  key: string,
  framework: string,
  ifcNames: Record<string, string> = {},
) {
  if (framework === "IFC") {
    if (key === "PS-none")
      return { code: "", name: "Not mapped to a Performance Standard" };
    return { code: key.replace("PS", "PS "), name: ifcNames[key] ?? "" };
  }
  return { code: shortCode(key), name: key };
}

function csvEscape(field: unknown) {
  const str = field == null ? "" : String(field);
  return `"${str.replace(/"/g, '""')}"`;
}

export function buildCsv(rows: EsgRowData[]) {
  const header = [
    "Theme",
    "Category",
    "Sub Factor",
    "Frameworks",
    "Keywords",
    "Documents",
    "Metrics",
    "Highlights",
    "Record Type",
    "Indicator ID",
    "Question Reference (source)",
    "Reference Review",
    "Questionnaire Version",
    "Industry",
    "Applicability",
    "Evidence Status",
    "Crosswalk Mappings",
    "Catalogue Source",
  ];
  const lines = [header.map(csvEscape).join(",")];

  rows.forEach((row) => {
    const documents = row.documents
      .map((d) => (d.url ? `${d.label} (${d.url})` : d.label))
      .join("; ");
    const metrics = row.metrics.map((m) => `${m.label}: ${m.value}`).join("; ");
    const frameworks = (row.frameworks ?? [])
      .map((f) => {
        const text = f.full || f.detail;
        return `${f.name}${f.verified ? "" : " (provisional)"}${
          text ? `: ${text}` : ""
        }`;
      })
      .join(" | ");

    lines.push(
      [
        row.theme,
        row.category,
        row.subfactor,
        frameworks,
        row.keywords.join("; "),
        documents,
        metrics,
        row.highlights,
        row.kpi ? "KPI indicator" : "Company disclosure",
        row.kpi?.id,
        row.kpi?.questionReference,
        row.kpi?.referenceNeedsReview ? "Numeric Excel reference: review required" : "",
        row.kpi ? row.kpi.version ?? "Not specified" : "",
        row.kpi ? row.kpi.industry ?? "Not specified" : "",
        row.kpi?.applicability,
        row.kpi ? "No evidence linked" : "",
        row.kpi?.mappings.map((m) => [m.framework, m.reference ?? "No reference supplied", m.title, m.section, m.principle, m.alignment ?? "Alignment not specified", "Provisional"].filter(Boolean).join(": ")).join(" | "),
        row.kpi ? `${row.kpi.source.file} / ${row.kpi.source.sheet} / row ${row.kpi.source.row}` : "",
      ]
        .map(csvEscape)
        .join(","),
    );
  });

  return `\uFEFF${lines.join("\r\n")}\r\n`;
}

export function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function downloadCsv(company: string, rows: EsgRowData[]) {
  const blob = new Blob([buildCsv(rows)], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const now = new Date();
  const dateStr = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");

  const a = document.createElement("a");
  a.href = url;
  a.download = `esg-profile-${slugify(company)}-${dateStr}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
