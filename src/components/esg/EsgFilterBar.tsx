import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ALL_FRAMEWORKS,
  ALL_KEYWORDS,
  ALL_THEMES,
  FRAMEWORK_ORDER,
  FRAMEWORK_TYPES,
  ALL_FRAMEWORK_TYPES,
  frameworkMatchesType,
} from "@/lib/esg";

interface EsgFilterBarProps {
  themes: string[];
  theme: string;
  onThemeChange: (value: string) => void;
  keywords: string[];
  keywordCounts: Record<string, number>;
  keyword: string;
  onKeywordChange: (value: string) => void;
  framework: string;
  frameworkCounts: Record<string, number>;
  onFrameworkChange: (value: string) => void;
  frameworkType: string;
  onFrameworkTypeChange: (value: string) => void;
  onClearFilters: () => void;
  search: string;
  onSearchChange: (value: string) => void;
  onDownload: () => void;
  onPrint: () => void;
  visibleCount: number;
  totalCount: number;
}

export function EsgFilterBar({
  themes,
  theme,
  onThemeChange,
  keywords,
  keywordCounts,
  keyword,
  onKeywordChange,
  framework,
  frameworkCounts,
  onFrameworkChange,
  frameworkType,
  onFrameworkTypeChange,
  onClearFilters,
  search,
  onSearchChange,
  onDownload,
  onPrint,
  visibleCount,
  totalCount,
}: EsgFilterBarProps) {
  return (
    <div className="mb-8 print:hidden">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Select value={frameworkType} onValueChange={onFrameworkTypeChange}>
            <SelectTrigger className="w-full" aria-label="Filter by framework type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_FRAMEWORK_TYPES}>{ALL_FRAMEWORK_TYPES}</SelectItem>
              {FRAMEWORK_TYPES.map((type) => <SelectItem key={type} value={type}>{type}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={framework} onValueChange={onFrameworkChange}>
            <SelectTrigger className="w-full" aria-label="Filter by framework">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_FRAMEWORKS}>{ALL_FRAMEWORKS}</SelectItem>
              {FRAMEWORK_ORDER.filter((f) => frameworkMatchesType(f, frameworkType)).map((f) => (
                <SelectItem key={f} value={f}>
                  {f} ({frameworkCounts[f] ?? 0})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={theme} onValueChange={onThemeChange}>
            <SelectTrigger className="w-full" aria-label="Filter by theme">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_THEMES}>{ALL_THEMES}</SelectItem>
              {themes.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={keyword} onValueChange={onKeywordChange}>
            <SelectTrigger
              className="w-full"
              aria-label="Filter by keyword"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              <SelectItem value={ALL_KEYWORDS}>{ALL_KEYWORDS}</SelectItem>
              {keywords.map((kw) => (
                <SelectItem key={kw} value={kw}>
                  {kw} ({keywordCounts[kw] ?? 0})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative w-full sm:col-span-2">
            <Input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search disclosures, indicators or references…"
              autoComplete="off"
              aria-label="Search disclosures and indicators"
              className="pr-9"
            />
            {search.length > 0 && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => onSearchChange("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" size="sm" onClick={onDownload}>
            Download CSV
          </Button>
          <Button variant="outline" size="sm" onClick={onPrint}>
            Print / PDF
          </Button>
          <Button variant="ghost" size="sm" onClick={onClearFilters}>Clear filters</Button>
        </div>
      </div>

      <p className="mt-4 text-sm text-muted-foreground" aria-live="polite">
        Showing {visibleCount} of {totalCount} records (disclosures and KPI indicators)
      </p>
    </div>
  );
}
