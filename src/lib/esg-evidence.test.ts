import { describe, expect, it } from "vitest";
import disclosures from "../../public/data/esg-disclosures.json";
import catalogue from "../../public/data/esg-kpis.json";
import { parseKpiCatalogue } from "./esg-catalogue";
import { buildCsv, kpiToRow, type EsgKpi } from "./esg";
import { buildEvidenceIndex, griReferences, matchKpiEvidence } from "./esg-evidence";

const kpis = parseKpiCatalogue(catalogue);
const index = buildEvidenceIndex(disclosures.rows);
const scopeOne = kpis.find((item) => item.indicator === "Scope 1 GHG emissions")!;

describe("GRI evidence crosswalk", () => {
  it("normalizes subclauses, ranges, slash lists and omitted GRI prefixes", () => {
    expect(griReferences("GRI 305-1-a, 305-1-b, 305-2-a")).toEqual(["305-1", "305-2"]);
    expect(griReferences("GRI 306-1 to 306-5; GRI 301-2/3")).toEqual(["306-1", "306-2", "306-3", "306-4", "306-5", "301-2", "301-3"]);
    expect(griReferences("GRI 302-1/3/4; GRI 2-9; 2-12 to 2-14")).toEqual(["302-1", "302-3", "302-4", "2-9", "2-12", "2-13", "2-14"]);
    expect(griReferences("GRI 101: Biodiversity 2024; GRI 305 series")).toEqual([]);
  });

  it("links real Scope 1 evidence without inventing or copying values into KPI metrics", () => {
    const matches = matchKpiEvidence(scopeOne, index);
    expect(matches).toHaveLength(1);
    expect(matches[0].disclosure.subfactor).toBe("Amount of GHG Emission (Scope 1 and 2)");
    expect(matches[0].disclosure.highlights).toContain("11,965.74");
    expect(matches[0].disclosure.highlights).toContain("11,493.78");
    expect(matches[0].alignment).toBe("Direct");
    const row = kpiToRow(scopeOne, matches);
    expect(row.metrics).toEqual([]);
    expect(row.documents[0].label).toContain("Page 303");
    const csv = buildCsv([row]);
    expect(csv).toContain("1 matching disclosure");
    expect(csv).toContain("11,965.74");
    expect(csv).toContain("GRI 305-1");
  });

  it("preserves partial/contextual alignment and does not match absent references", () => {
    for (const alignment of ["Partial", "Contextual"]) {
      const item: EsgKpi = { ...scopeOne, mappings: [{ ...scopeOne.mappings[0], alignment }] };
      expect(matchKpiEvidence(item, index)[0].alignment).toBe(alignment);
    }
    const currency = kpis.find((item) => item.framework === "CDP" && item.indicator === "Reporting currency")!;
    expect(matchKpiEvidence(currency, index)).toEqual([]);
    expect(matchKpiEvidence({ ...scopeOne, mappings: [{ ...scopeOne.mappings[0], reference: "No direct GRI disclosure" }] }, index)).toEqual([]);
  });

  it("deduplicates multi-reference matches and treats series matches as contextual", () => {
    const item: EsgKpi = { ...scopeOne, mappings: [{ ...scopeOne.mappings[0], reference: "GRI 305-1; GRI 305-2" }] };
    expect(matchKpiEvidence(item, index)).toHaveLength(1);
    expect(matchKpiEvidence(item, index)[0].references).toEqual(["305-1", "305-2"]);
    const broad = matchKpiEvidence({ ...item, mappings: [{ ...item.mappings[0], reference: "GRI 305 series" }] }, index);
    expect(broad.length).toBeGreaterThan(0);
    expect(broad.every((match) => match.broad && match.alignment === "Contextual")).toBe(true);
  });

  it("does not equate generic standard tags or similar numbered disclosures", () => {
    const source = { ...disclosures.rows[0], frameworks: [{ name: "GRI", full: "GRI 305, GRI 305-10" }] };
    expect(matchKpiEvidence(scopeOne, buildEvidenceIndex([source]))).toEqual([]);
  });
});
