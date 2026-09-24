import { describe, expect, it } from "vitest";
import catalogue from "../../public/data/esg-kpis.json";
import existingData from "../../public/data/esg-disclosures.json";
import { parseKpiCatalogue } from "./esg-catalogue";
import {
  ALL_FRAMEWORKS, ALL_FRAMEWORK_TYPES, ALL_KEYWORDS, ALL_THEMES,
  buildCsv, frameworkCounts, frameworkMatchesType, groupKey, kpiToRow, rowMatches,
} from "./esg";

const indicators = parseKpiCatalogue(catalogue);
const rows = indicators.map((indicator) => kpiToRow(indicator));
const matches = (framework = ALL_FRAMEWORKS, type = ALL_FRAMEWORK_TYPES, query = "") =>
  rows.filter((row) => rowMatches(row, ALL_THEMES, ALL_KEYWORDS, query, framework, type));

describe("KPI catalogue and framework filtering", () => {
  it("imports every nonempty workbook row with unique identities and provenance", () => {
    expect(indicators).toHaveLength(408);
    expect(new Set(indicators.map((item) => item.id)).size).toBe(408);
    expect(matches("CDP")).toHaveLength(116);
    expect(matches("CSA")).toHaveLength(292);
    for (const [framework, end] of [["CDP", 117], ["CSA", 293]] as const) {
      expect(indicators.filter((item) => item.framework === framework).map((item) => item.source.row))
        .toEqual(Array.from({ length: end - 1 }, (_, i) => i + 2));
    }
  });

  it("discovers CDP in both reporting and assessment types", () => {
    expect(matches("CDP", "Reporting & disclosure")).toHaveLength(116);
    expect(matches("CDP", "Ratings & assessments")).toHaveLength(116);
    expect(matches("CSA", "Reporting & disclosure")).toHaveLength(0);
    expect(matches(ALL_FRAMEWORKS, "Ratings & assessments")).toHaveLength(408);
    expect(frameworkMatchesType("IFC", "Performance standards")).toBe(true);
  });

  it("does not promote crosswalk mappings to native GRI/BRSR disclosures", () => {
    expect(matches("GRI")).toHaveLength(0);
    expect(matches("BRSR")).toHaveLength(0);
    expect(matches("IFC")).toHaveLength(0);
    expect(rows.every((row) => row.metrics.length === 0 && row.documents.length === 0)).toBe(true);
  });

  it("keeps all existing framework results intact", () => {
    for (const framework of ["BRSR", "BRSR Core", "GRI", "IFC"]) {
      const before = existingData.rows.filter((row) => rowMatches(row, ALL_THEMES, ALL_KEYWORDS, "", framework));
      const after = [...existingData.rows, ...rows].filter((row) => rowMatches(row, ALL_THEMES, ALL_KEYWORDS, "", framework));
      expect(after).toEqual(before);
    }
  });

  it("requires the selected framework itself to belong to the selected type", () => {
    const row = { ...rows[0], frameworks: [{ name: "GRI" }, { name: "IFC" }] };
    expect(rowMatches(row, ALL_THEMES, ALL_KEYWORDS, "", "GRI", "Performance standards")).toBe(false);
  });

  it("combines theme, topic, search and framework with AND semantics", () => {
    const scopeOne = rows.find((row) => row.subfactor === "Scope 1 GHG emissions")!;
    expect(rowMatches(scopeOne, "Environment", "Climate Strategy", "  SCOPE 1  ", "CSA")).toBe(true);
    expect(rowMatches(scopeOne, "Social", "Climate Strategy", "scope 1", "CSA")).toBe(false);
    expect(rowMatches(scopeOne, "Environment", "Water", "scope 1", "CSA")).toBe(false);
    expect(rowMatches(scopeOne, "Environment", "Climate Strategy", "scope 1", "CDP")).toBe(false);
    expect(rowMatches(scopeOne, "Environment", "Climate Strategy", "GRI 305-1", "CSA")).toBe(true);
  });

  it("searches question references and groups by native topic", () => {
    const row = rows.find((item) => item.kpi?.questionReference === "1.4.1")!;
    expect(rowMatches(row, ALL_THEMES, ALL_KEYWORDS, "1.4.1", "CDP")).toBe(true);
    expect(groupKey(row, "CDP")).toBe("CDP · 1 - Introduction");
    expect(groupKey(rows.find((item) => item.subfactor === "Scope 1 GHG emissions")!, "CSA")).toBe("CSA · Climate Strategy");
  });

  it("counts a row only once for each framework", () => {
    const row = { ...rows[0], frameworks: [{ name: "CDP" }, { name: "CDP" }, { name: "GRI" }] };
    expect(frameworkCounts([row])).toEqual({ CDP: 1, GRI: 1 });
  });

  it("preserves ambiguous numeric references without inventing trailing zeroes", () => {
    const item = indicators.find((item) => item.source.sheet === "CDP" && item.source.row === 11)!;
    expect(item.questionReference).toBe("1.1");
    expect(item.referenceNeedsReview).toBe(true);
    expect(item.source.originalReference).toBe(1.1);
    expect(indicators.every((item) => item.version === null && item.industry === null && item.applicability === "unconfirmed")).toBe(true);
  });

  it("exports only supplied filtered records, preserving status and mapping details", () => {
    const selected = matches("CDP", ALL_FRAMEWORK_TYPES, "Reporting currency");
    expect(selected).toHaveLength(1);
    const csv = buildCsv(selected);
    expect(csv).toContain('"KPI indicator"');
    expect(csv).toContain('"No matching disclosure found"');
    expect(csv).toContain("KPIs.xlsx / CDP / row 2");
    expect(csv).toContain("Numeric Excel reference: review required");
    expect(csv).toContain("GRI: No reference supplied: Alignment not specified: Provisional");
    expect(csv).not.toContain("Fiscal year-end date");
  });

  it("rejects malformed catalogues instead of crashing during rendering", () => {
    expect(() => parseKpiCatalogue({ schemaVersion: 2, indicators: [] })).toThrow();
    expect(() => parseKpiCatalogue({ schemaVersion: 1, indicators: [{}] })).toThrow();
    expect(() => parseKpiCatalogue({ schemaVersion: 1, indicators: [indicators[0], indicators[0]] })).toThrow();
  });
});
