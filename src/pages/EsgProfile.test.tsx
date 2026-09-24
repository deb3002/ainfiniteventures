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
    expect(screen.getByText("No evidence linked")).toBeInTheDocument();
    expect(screen.getByText(/Stored as a number in Excel/)).toBeInTheDocument();
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
});
