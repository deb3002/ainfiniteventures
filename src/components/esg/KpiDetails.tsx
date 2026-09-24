import type { EsgKpi } from "@/lib/esg";

export function KpiDetails({ kpi }: { kpi: EsgKpi }) {
  return (
    <div className="mb-4 space-y-3 text-sm">
      {kpi.questionReference && (
        <p><span className="font-medium">Question reference:</span> {kpi.questionReference}
          {kpi.referenceNeedsReview && <span className="block text-xs text-muted-foreground">Stored as a number in Excel; verify the original question code.</span>}
        </p>
      )}
      <p className="text-xs text-muted-foreground">
        Questionnaire year: {kpi.version ?? "Not specified"} · Industry: {kpi.industry ?? "Not specified"} · Applicability: unconfirmed
      </p>
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
