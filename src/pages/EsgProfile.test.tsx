import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import EsgProfile from "./EsgProfile";
import catalogue from "../../public/data/esg-kpis.json";

vi.mock("@/components/Layout", () => ({ Layout: ({ children }: { children: React.ReactNode }) => <>{children}</> }));
vi.mock("@/components/FadeIn", () => ({ FadeIn: ({ children }: { children: React.ReactNode }) => <>{children}</> }));

const disclosure = {
  company: "Example company", updated: "2026", themes: ["Environment"],
  rows: [{ theme: "Environment", category: "Energy", subfactor: "Existing energy disclosure", keywords: [], documents: [], metrics: [], frameworks: [], highlights: "Existing company evidence is preserved." }],
};

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe("ESG catalogue loading", () => {
  it("shows imported indicators alongside existing disclosures without treating them as evidence", async () => {
    vi.stubGlobal("fetch", vi.fn(async (url: string) => ({ ok: true, json: async () => url.includes("esg-kpis") ? { ...catalogue, indicators: [catalogue.indicators[0]] } : disclosure })));
    render(<MemoryRouter><EsgProfile /></MemoryRouter>);
    expect(await screen.findByText("Reporting currency")).toBeInTheDocument();
    expect(screen.getByText("Existing energy disclosure")).toBeInTheDocument();
    expect(screen.getByText("Showing 2 of 2 records (disclosures and KPI indicators)")).toBeInTheDocument();
    expect(screen.getByText("No matching disclosure found")).toBeInTheDocument();
    expect(screen.queryByText(/Stored as a number in Excel/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Applicability: unconfirmed/)).not.toBeInTheDocument();
    expect(screen.queryByText("1.2", { exact: true })).not.toBeInTheDocument();
  });

  it.each(["unavailable", "malformed"])("keeps existing disclosures usable when the catalogue is %s", async (failure) => {
    vi.stubGlobal("fetch", vi.fn(async (url: string) => url.includes("esg-kpis")
      ? { ok: failure !== "unavailable", json: async () => ({ schemaVersion: 1, indicators: [{}] }) }
      : { ok: true, json: async () => disclosure }));
    render(<MemoryRouter><EsgProfile /></MemoryRouter>);
    expect(await screen.findByRole("alert")).toHaveTextContent("CDP/CSA indicators could not be loaded");
    expect(screen.getByText("Existing energy disclosure")).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText("Loading CDP/CSA indicators…")).not.toBeInTheDocument());
  });

  it("renders the existing evidence and alignment under the matching CSA indicator", async () => {
    const indicator = catalogue.indicators.find((item) => item.indicator === "Scope 1 GHG emissions")!;
    const company = { ...disclosure, rows: [{ ...disclosure.rows[0], subfactor: "Scope 1 source", highlights: "FY2026: 11,965.74 MT CO2e", frameworks: [{ name: "GRI", full: "GRI 305-1-a" }], documents: [{ label: "Annual report page 303", url: null }] }] };
    vi.stubGlobal("fetch", vi.fn(async (url: string) => ({ ok: true, json: async () => url.includes("esg-kpis") ? { ...catalogue, indicators: [indicator] } : company })));
    render(<MemoryRouter><EsgProfile /></MemoryRouter>);
    expect(await screen.findByText("1 matching disclosure")).toBeInTheDocument();
    const evidence = screen.getByRole("region", { name: "Linked disclosure: Scope 1 source" });
    expect(evidence).toHaveTextContent("Direct alignment · GRI 305-1");
    expect(evidence).toHaveTextContent("FY2026: 11,965.74 MT CO2e");
    expect(evidence).toHaveTextContent("Annual report page 303");
  });
});
