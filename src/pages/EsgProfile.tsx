import { useEffect, useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { FadeIn } from "@/components/FadeIn";
import { Button } from "@/components/ui/button";
import { EsgFilterBar } from "@/components/esg/EsgFilterBar";
import { EsgTable } from "@/components/esg/EsgTable";
import { parseKpiCatalogue } from "@/lib/esg-catalogue";
import {
  ALL_FRAMEWORKS,
  ALL_FRAMEWORK_TYPES,
  ALL_KEYWORDS,
  ALL_THEMES,
  EsgData,
  EsgKpi,
  downloadCsv,
  frameworkCounts as computeFrameworkCounts,
  keywordCountsForTheme,
  rowMatches,
  sortedKeywords,
  kpiToRow,
  frameworkMatchesType,
} from "@/lib/esg";

const EsgProfile = () => {
  const [data, setData] = useState<EsgData | null>(null);
  const [error, setError] = useState(false);
  const [catalogueError, setCatalogueError] = useState(false);
  const [catalogueLoading, setCatalogueLoading] = useState(true);
  const [kpis, setKpis] = useState<EsgKpi[]>([]);
  const [theme, setTheme] = useState(ALL_THEMES);
  const [keyword, setKeyword] = useState(ALL_KEYWORDS);
  const [framework, setFramework] = useState(ALL_FRAMEWORKS);
  const [frameworkType, setFrameworkType] = useState(ALL_FRAMEWORK_TYPES);
  const [search, setSearch] = useState("");

  useEffect(() => {
    document.title = "ESG Profile | Ainfinite Ventures LLP";
    let mounted = true;
    fetch("/data/esg-disclosures.json")
      .then((res) => {
        if (!res.ok) throw new Error("failed");
        return res.json();
      })
      .then((json: EsgData) => {
        if (mounted) setData(json);
      })
      .catch(() => {
        if (mounted) setError(true);
      });
    fetch("/data/esg-kpis.json")
      .then((res) => {
        if (!res.ok) throw new Error("failed");
        return res.json();
      })
      .then((json: unknown) => {
        const indicators = parseKpiCatalogue(json);
        if (mounted) setKpis(indicators);
      })
      .catch(() => {
        if (mounted) setCatalogueError(true);
      })
      .finally(() => {
        if (mounted) setCatalogueLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const rows = useMemo(() => [...(data?.rows ?? []), ...kpis.map(kpiToRow)], [data, kpis]);
  const themes = useMemo(() => [...new Set([...(data?.themes ?? []), ...kpis.map((kpi) => kpi.theme)])], [data, kpis]);
  const scopeRows = useMemo(() => rows.filter((row) => rowMatches(row, ALL_THEMES, ALL_KEYWORDS, search, framework, frameworkType)), [rows, framework, frameworkType, search]);

  const keywordCounts = useMemo(
    () => keywordCountsForTheme(scopeRows, theme),
    [scopeRows, theme],
  );
  const keywords = useMemo(() => {
    const available = sortedKeywords(keywordCounts);
    // Keep an active zero-result keyword visible so users can understand/reset it.
    return keyword !== ALL_KEYWORDS && !available.includes(keyword) ? [keyword, ...available] : available;
  }, [keywordCounts, keyword]);
  const frameworkCounts = useMemo(
    () => computeFrameworkCounts(rows.filter((row) => rowMatches(row, theme, keyword, search, ALL_FRAMEWORKS, frameworkType))),
    [rows, theme, keyword, search, frameworkType],
  );

  const visibleRows = useMemo(() => {
    if (!data) return [];
    const query = search.trim().toLowerCase();
    return rows.filter((row) =>
      rowMatches(row, theme, keyword, query, framework, frameworkType),
    );
  }, [data, rows, theme, keyword, search, framework, frameworkType]);

  const handleFrameworkChange = (value: string) => {
    setFramework(value);
    setKeyword(ALL_KEYWORDS);
  };

  const handleFrameworkTypeChange = (value: string) => {
    setFrameworkType(value);
    if (framework !== ALL_FRAMEWORKS && !frameworkMatchesType(framework, value)) setFramework(ALL_FRAMEWORKS);
    setKeyword(ALL_KEYWORDS);
  };

  const handleThemeChange = (value: string) => {
    setTheme(value);
    setKeyword(ALL_KEYWORDS);
  };

  const clearFilters = () => {
    setTheme(ALL_THEMES);
    setKeyword(ALL_KEYWORDS);
    setFramework(ALL_FRAMEWORKS);
    setFrameworkType(ALL_FRAMEWORK_TYPES);
    setSearch("");
  };

  return (
    <Layout>
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <p className="text-sm font-medium text-accent tracking-widest uppercase mb-4">
              ESG Profile
            </p>
            <h1 className="text-3xl md:text-5xl font-semibold text-foreground leading-tight">
              {data?.company ?? "ESG Disclosure Profile"}
            </h1>
            {data && (
              <p className="mt-3 text-sm text-muted-foreground">
                Updated {data.updated}
              </p>
            )}
          </FadeIn>

          {data && (
            <p className="hidden print:block mt-4 text-xs text-muted-foreground">
              {data.company} — ESG Profile — Updated: {data.updated} — {theme} ·{" "}
              {keyword} · {frameworkType} · {framework} · Search: {search || "None"} · {visibleRows.length} of {rows.length} records
            </p>
          )}

          <div className="mt-12">
            {error ? (
              <p className="text-muted-foreground">
                Could not load the disclosure data. Please refresh the page.
              </p>
            ) : !data ? (
              <p className="text-muted-foreground">Loading disclosures…</p>
            ) : (
              <>
                {catalogueError && (
                  <p role="alert" className="mb-4 text-sm text-destructive">
                    CDP/CSA indicators could not be loaded. Existing disclosures remain available. Refresh to retry.
                  </p>
                )}
                {catalogueLoading && <p role="status" className="mb-4 text-sm text-muted-foreground">Loading CDP/CSA indicators…</p>}
                <p className="mb-6 text-sm text-muted-foreground">
                  Explore company disclosures and CDP/CSA indicators. Workbook crosswalks are provisional;
                  questionnaire year and applicability require review. An indicator is not evidence of a completed response or a rating.
                </p>
                <EsgFilterBar
                  themes={themes}
                  theme={theme}
                  onThemeChange={handleThemeChange}
                  keywords={keywords}
                  keywordCounts={keywordCounts}
                  keyword={keyword}
                  onKeywordChange={setKeyword}
                  framework={framework}
                  frameworkCounts={frameworkCounts}
                  onFrameworkChange={handleFrameworkChange}
                  frameworkType={frameworkType}
                  onFrameworkTypeChange={handleFrameworkTypeChange}
                  onClearFilters={clearFilters}
                  search={search}
                  onSearchChange={setSearch}
                  onDownload={() => downloadCsv(data.company, visibleRows)}
                  onPrint={() => window.print()}
                  visibleCount={visibleRows.length}
                  totalCount={rows.length}
                />

                {visibleRows.length === 0 ? (
                  <div className="py-20 text-center">
                    <p className="text-muted-foreground mb-4">
                      No records match your filters.
                    </p>
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Clear filters
                    </Button>
                  </div>
                ) : (
                  <EsgTable
                    rows={visibleRows}
                    framework={framework}
                    ifcNames={data.ifcNames ?? {}}
                  />
                )}
              </>
            )}
          </div>

          <p className="mt-16 text-xs text-muted-foreground">
            Demo — data shown is illustrative.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default EsgProfile;
