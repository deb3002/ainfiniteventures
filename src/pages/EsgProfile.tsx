import { useEffect, useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { FadeIn } from "@/components/FadeIn";
import { Button } from "@/components/ui/button";
import { EsgFilterBar } from "@/components/esg/EsgFilterBar";
import { EsgTable } from "@/components/esg/EsgTable";
import {
  ALL_FRAMEWORKS,
  ALL_KEYWORDS,
  ALL_THEMES,
  EsgData,
  downloadCsv,
  frameworkCounts as computeFrameworkCounts,
  keywordCountsForTheme,
  rowMatches,
  sortedKeywords,
} from "@/lib/esg";

const EsgProfile = () => {
  const [data, setData] = useState<EsgData | null>(null);
  const [error, setError] = useState(false);
  const [theme, setTheme] = useState(ALL_THEMES);
  const [keyword, setKeyword] = useState(ALL_KEYWORDS);
  const [framework, setFramework] = useState(ALL_FRAMEWORKS);
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
    return () => {
      mounted = false;
    };
  }, []);

  const keywordCounts = useMemo(
    () => keywordCountsForTheme(data?.rows ?? [], theme),
    [data, theme],
  );
  const keywords = useMemo(() => sortedKeywords(keywordCounts), [keywordCounts]);

  const visibleRows = useMemo(() => {
    if (!data) return [];
    const query = search.trim().toLowerCase();
    return data.rows.filter((row) => rowMatches(row, theme, keyword, query));
  }, [data, theme, keyword, search]);

  const handleThemeChange = (value: string) => {
    setTheme(value);
    setKeyword(ALL_KEYWORDS);
  };

  const clearFilters = () => {
    setTheme(ALL_THEMES);
    setKeyword(ALL_KEYWORDS);
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
              {keyword} · {visibleRows.length} of {data.rows.length} disclosures
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
                <EsgFilterBar
                  themes={data.themes}
                  theme={theme}
                  onThemeChange={handleThemeChange}
                  keywords={keywords}
                  keywordCounts={keywordCounts}
                  keyword={keyword}
                  onKeywordChange={setKeyword}
                  search={search}
                  onSearchChange={setSearch}
                  onDownload={() => downloadCsv(data.company, visibleRows)}
                  onPrint={() => window.print()}
                  visibleCount={visibleRows.length}
                  totalCount={data.rows.length}
                />

                {visibleRows.length === 0 ? (
                  <div className="py-20 text-center">
                    <p className="text-muted-foreground mb-4">
                      No disclosures match your filters.
                    </p>
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Clear filters
                    </Button>
                  </div>
                ) : (
                  <EsgTable rows={visibleRows} />
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
