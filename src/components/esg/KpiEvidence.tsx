import { useState } from "react";
import type { EvidenceMatch } from "@/lib/esg-evidence";
import { formatMetricValue } from "@/lib/esg";
import { EsgSeriesChart } from "./EsgSeriesChart";

export function KpiEvidence({ match }: { match: EvidenceMatch }) {
  const [expanded, setExpanded] = useState(false);
  const row = match.disclosure;
  const metrics = row.standalone ?? (row.series ? [] : row.metrics);
  const long = row.highlights.length > 420;
  return (
    <section className="mb-4 space-y-2 rounded-lg border border-border bg-secondary/30 p-3 text-sm" aria-label={`Linked disclosure: ${row.subfactor}`}>
      <h3 className="font-semibold">{row.subfactor}</h3>
      <p className="text-xs text-muted-foreground">{match.alignment} alignment · {match.references.map((ref) => `GRI ${ref}`).join(", ")}</p>
      {match.broad && <p className="text-xs text-muted-foreground">Related information matched through a broad GRI series reference.</p>}
      <p className="text-xs text-muted-foreground">Source category: {row.category}</p>
      {row.documents.map((doc, i) => doc.url
        ? <a key={i} className="block text-xs text-accent hover:underline" href={doc.url} target="_blank" rel="noopener noreferrer">{doc.label}</a>
        : <p key={i} className="text-xs text-muted-foreground">{doc.label}</p>)}
      {metrics.map((metric, i) => <p key={i}><span className="font-semibold">{formatMetricValue(metric.value)}</span> · {metric.label}</p>)}
      {row.series?.map((series, i) => <EsgSeriesChart key={i} series={series} />)}
      <p className={`whitespace-pre-line leading-relaxed text-muted-foreground print:line-clamp-none ${long && !expanded ? "line-clamp-5" : ""}`}>{row.highlights}</p>
      {long && <button type="button" className="text-xs text-accent hover:underline print:hidden" onClick={() => setExpanded((value) => !value)}>{expanded ? "Show less evidence" : "Show full evidence"}</button>}
    </section>
  );
}
