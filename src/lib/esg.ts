export interface EsgDocument {
  label: string;
  url: string | null;
}

export interface EsgMetric {
  value: number | string;
  label: string;
}

export interface EsgRowData {
  theme: string;
  category: string;
  subfactor: string;
  keywords: string[];
  documents: EsgDocument[];
  metrics: EsgMetric[];
  highlights: string;
}

export interface EsgData {
  company: string;
  updated: string;
  themes: string[];
  rows: EsgRowData[];
}

export const ALL_THEMES = "All Themes";
export const ALL_KEYWORDS = "All Keywords";

/** Group digits without rounding or altering the stored value. */
export function formatMetricValue(value: number | string) {
  const str = String(value);
  const [intPart, ...rest] = str.split(".");
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return rest.length > 0 ? `${grouped}.${rest.join(".")}` : grouped;
}

export function rowMatches(
  row: EsgRowData,
  theme: string,
  keyword: string,
  query: string,
) {
  if (theme !== ALL_THEMES && row.theme !== theme) return false;
  if (keyword !== ALL_KEYWORDS && !row.keywords.includes(keyword)) return false;
  if (query === "") return true;

  const haystack = [
    row.subfactor,
    row.category,
    row.keywords.join(" "),
    row.metrics.map((m) => m.label).join(" "),
    row.highlights,
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
  return Object.keys(counts).sort(
    (a, b) => counts[b] - counts[a] || a.localeCompare(b),
  );
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
    "Keywords",
    "Documents",
    "Metrics",
    "Highlights",
  ];
  const lines = [header.map(csvEscape).join(",")];

  rows.forEach((row) => {
    const documents = row.documents
      .map((d) => (d.url ? `${d.label} (${d.url})` : d.label))
      .join("; ");
    const metrics = row.metrics.map((m) => `${m.label}: ${m.value}`).join("; ");
    lines.push(
      [
        row.theme,
        row.category,
        row.subfactor,
        row.keywords.join("; "),
        documents,
        metrics,
        row.highlights,
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
