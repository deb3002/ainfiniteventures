import { useState } from "react";
import { EsgRowData, formatMetricValue } from "@/lib/esg";

export function EsgRow({ row }: { row: EsgRowData }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = row.highlights.length > 420;

  return (
    <tr className="border-b border-border/60 align-top">
      <td className="py-5 pr-4 w-[18%] text-sm font-medium text-foreground">
        {row.subfactor}
      </td>
      <td className="py-5 pr-4 w-[14%]">
        {row.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {row.keywords.map((kw) => (
              <span
                key={kw}
                className="text-[11px] font-medium tracking-wide px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
              >
                {kw}
              </span>
            ))}
          </div>
        )}
      </td>
      <td className="py-5 pr-4 w-[18%]">
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
        {row.metrics.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-6 rounded-xl border border-border bg-secondary/40 p-4 print:border-border">
            {row.metrics.map((m, i) => (
              <div key={i}>
                <div className="text-lg font-semibold text-foreground tabular-nums">
                  {formatMetricValue(m.value)}
                </div>
                <div className="text-xs text-muted-foreground">{m.label}</div>
              </div>
            ))}
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
