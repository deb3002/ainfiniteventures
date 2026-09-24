import type { EsgKpi } from "@/lib/esg";

export function KpiDetails({ kpi }: { kpi: EsgKpi }) {
  return (
    <div className="mb-4 space-y-3 text-sm">
      {kpi.questionReference && (
        <p><span className="font-medium">Question reference:</span> {kpi.questionReference}
          {kpi.referenceNeedsReview && <span className="block text-xs text-muted-foreground">Stored as a number in Excel; verify the original question code.</span>}
        </p>
      )}
      <div className="space-y-2 rounded-lg border border-border p-3">
        <p className="font-medium">Cross-framework alignment</p>
        {kpi.mappings.map((mapping) => (
          <div key={mapping.framework} className="text-xs leading-relaxed text-muted-foreground">
            <p><span className="font-semibold text-foreground">{mapping.framework}</span> · {mapping.alignment ?? "Alignment not specified"} · Provisional</p>
            <p>{mapping.reference ?? "No reference supplied"}</p>
            {mapping.title && <p>{mapping.title}</p>}
            {mapping.section && <p>{mapping.section}{mapping.principle ? ` · ${mapping.principle}` : ""}</p>}
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Questionnaire year: {kpi.version ?? "Not specified"} · Industry: {kpi.industry ?? "Not specified"} · Applicability: unconfirmed
      </p>
      <p className="text-xs text-muted-foreground break-words">
        Catalogue source: {kpi.source.file} / {kpi.source.sheet}, row {kpi.source.row}
        <span className="block">Internal ID: {kpi.id}</span>
      </p>
    </div>
  );
}
