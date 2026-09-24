import type { EsgKpi } from "@/lib/esg";

export function KpiDetails({ kpi }: { kpi: EsgKpi }) {
  const questionReference = kpi.referenceNeedsReview ? null : kpi.questionReference;
  const context = [
    kpi.version ? `Questionnaire year: ${kpi.version}` : null,
    kpi.industry ? `Industry: ${kpi.industry}` : null,
  ].filter(Boolean).join(" · ");
  if (!questionReference && !context) return null;
  return (
    <div className="mb-4 space-y-3 text-sm">
      {questionReference && (
        <p><span className="font-medium">Question reference:</span> {questionReference}</p>
      )}
      {context && <p className="text-xs text-muted-foreground">{context}</p>}
    </div>
  );
}

export function KpiAlignment({ kpi }: { kpi: EsgKpi }) {
  const mappings = kpi.mappings.filter((mapping) => mapping.reference);
  if (!mappings.length) return null;
  return (
    <div className="mt-3 space-y-2 break-words">
      <p className="text-xs font-medium">Cross-framework alignment</p>
      {mappings.map((mapping) => (
        <div key={mapping.framework} className="text-xs leading-relaxed text-muted-foreground">
          <p><span className="font-semibold text-foreground">{mapping.framework}</span> · {mapping.alignment ?? "Alignment not specified"} · Provisional</p>
          <p>{mapping.reference ?? "No reference supplied"}</p>
          {mapping.title && <p>{mapping.title}</p>}
          {mapping.section && <p>{mapping.section}{mapping.principle ? ` · ${mapping.principle}` : ""}</p>}
        </div>
      ))}
    </div>
  );
}
