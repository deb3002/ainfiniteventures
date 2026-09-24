import type { EsgKpi, EsgRowData } from "./esg";

export interface EvidenceMatch {
  disclosure: EsgRowData;
  references: string[];
  alignment: string;
  broad: boolean;
}

/** Read disclosure IDs, including workbook ranges/slash lists and source subclauses.
 * Never treat a year or a generic GRI standard tag as an exact disclosure ID.
 */
export function griReferences(text: string): string[] {
  const normalized = text.replace(/[–—]/g, "-");
  const found = new Set<string>();
  for (const match of normalized.matchAll(/\b(\d{1,3})-(\d{1,2})(?:\s+to\s+(?:(\d{1,3})-)?(\d{1,2})|((?:\/\d{1,2})+))?/gi)) {
    const [, standard, first, endStandard, last, slash] = match;
    found.add(`${standard}-${Number(first)}`);
    if (last && (!endStandard || endStandard === standard) && Number(last) >= Number(first) && Number(last) - Number(first) <= 30) {
      for (let n = Number(first); n <= Number(last); n++) found.add(`${standard}-${n}`);
    }
    if (slash) for (const n of slash.slice(1).split("/")) found.add(`${standard}-${Number(n)}`);
  }
  return [...found];
}

export function buildEvidenceIndex(disclosures: EsgRowData[]) {
  const index = new Map<string, Set<EsgRowData>>();
  for (const row of disclosures) {
    if (row.kpi) continue;
    for (const framework of row.frameworks ?? []) {
      if (framework.name !== "GRI") continue;
      for (const ref of griReferences([framework.full, framework.detail, framework.indicator].filter(Boolean).join("; "))) {
        if (!index.has(ref)) index.set(ref, new Set());
        index.get(ref)!.add(row);
      }
    }
  }
  return index;
}

export function matchKpiEvidence(kpi: EsgKpi, index: ReturnType<typeof buildEvidenceIndex>): EvidenceMatch[] {
  const matches = new Map<EsgRowData, EvidenceMatch>();
  for (const mapping of kpi.mappings) {
    if (mapping.framework !== "GRI" || !mapping.reference || mapping.alignment === "No direct equivalent" || /no direct/i.test(mapping.reference)) continue;
    let refs = griReferences(mapping.reference);
    const series = /\bGRI\s+(\d{1,3})\s+series\b/i.exec(mapping.reference);
    const broad = refs.length === 0 && !!series;
    if (broad) refs = [...index.keys()].filter((ref) => ref.startsWith(`${series![1]}-`));
    for (const ref of refs) {
      for (const disclosure of index.get(ref) ?? []) {
        const existing = matches.get(disclosure);
        if (existing) {
          if (!existing.references.includes(ref)) existing.references.push(ref);
        } else {
          matches.set(disclosure, {
            disclosure, references: [ref], broad,
            alignment: broad ? "Contextual" : mapping.alignment ?? "Alignment not specified",
          });
        }
      }
    }
  }
  return [...matches.values()];
}

export function evidenceStatus(matches: EvidenceMatch[] = []) {
  return matches.length ? `${matches.length} matching disclosure${matches.length === 1 ? "" : "s"}` : "No matching disclosure found";
}
