import { useState } from "react";
import { EsgRowData, formatMetricValue } from "@/lib/esg";
import { EsgSeriesChart } from "./EsgSeriesChart";
import { KpiAlignment, KpiDetails } from "./KpiDetails";
import { KpiEvidence } from "./KpiEvidence";
import { evidenceStatus } from "@/lib/esg-evidence";

export function EsgRow({ row }: { row: EsgRowData }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = row.highlights.length > 420;

  const frameworks = row.frameworks ?? [];
  const frameworkNames = frameworks.map((f) => f.name);
  const visibleKeywords = row.keywords.filter(
    (kw) => !frameworkNames.includes(kw),
  );
  const series = row.series ?? [];
  const standalone = row.standalone ?? (row.series ? [] : row.metrics);

  return (
    <tr className="border-b border-border/60 align-top">
      <td className="py-5 pr-4 w-[18%] text-sm font-medium text-foreground">
        {row.subfactor}
        {row.kpi && <p className="mt-2 text-xs font-normal text-muted-foreground">KPI indicator</p>}
      </td>
      <td className="py-5 pr-4 w-[16%]">
        {frameworks.length > 0 && (
          <div className="mb-2 flex flex-col gap-1.5">
            {frameworks.map((f, i) => (
              <div key={i} className="flex flex-wrap items-baseline gap-1.5">
                <span
                  className={`text-[11px] font-semibold tracking-wide px-2 py-0.5 rounded-full ${
                    f.verified
                      ? "bg-accent/15 text-accent"
                      : "border border-dashed border-muted-foreground/50 text-muted-foreground"
                  }`}
                  title={row.kpi ? "Indicator imported from the supplied workbook" : f.verified ? undefined : "Provisional mapping — unverified"}
                >
                  {f.name}
                </span>
                {f.detail && !row.kpi?.referenceNeedsReview && (
                  <span
                    className="text-[11px] text-muted-foreground"
                    title={f.source ? `Source: ${f.source}` : undefined}
                  >
                    {f.detail}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
        {visibleKeywords.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {visibleKeywords.map((kw) => (
              <span
                key={kw}
                className="text-[11px] font-medium tracking-wide px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
              >
                {kw}
              </span>
            ))}
          </div>
        )}
        {row.kpi && <KpiAlignment kpi={row.kpi} />}
      </td>
      <td className="py-5 pr-4 w-[16%]">
        {row.kpi && <p className="mb-3 text-sm text-muted-foreground">{evidenceStatus(row.evidence)}</p>}
        {row.documents.length > 0 && (
          <div className="flex flex-col gap-1.5">
            {row.documents.map((doc, i) =>
              doc.url ? (
                <a
                  key={i}
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-accent hover:underline"
                >
                  {doc.label}
                </a>
              ) : (
                <span key={i} className="text-sm text-muted-foreground">
                  {doc.label}
                </span>
              ),
            )}
          </div>
        )}
      </td>
      <td className="py-5 w-[50%]">
        {row.kpi && <KpiDetails kpi={row.kpi} />}
        {row.evidence?.map((match, index) => <KpiEvidence key={index} match={match} />)}
        {(series.length > 0 || standalone.length > 0) && (
          <div className="mb-4 flex flex-col gap-3">
            {series.map((s, i) => (
              <EsgSeriesChart key={i} series={s} />
            ))}
            {standalone.length > 0 && (
              <div className="flex flex-wrap gap-6 rounded-xl border border-border bg-secondary/40 p-4">
                {standalone.map((m, i) => (
                  <div key={i}>
                    <div className="text-lg font-semibold text-foreground tabular-nums">
                      {formatMetricValue(m.value)}
                    </div>
                    <div className="text-xs text-muted-foreground">{m.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        <p
          className={`text-sm leading-relaxed text-muted-foreground print:line-clamp-none ${
            isLong && !expanded ? "line-clamp-4" : ""
          }`}
        >
          {row.highlights}
        </p>
        {isLong && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="mt-2 text-xs font-medium text-accent hover:underline print:hidden"
          >
            {expanded ? "Show less" : "Show more"}
          </button>
        )}
      </td>
    </tr>
  );
}
