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
import { ALL_KEYWORDS, ALL_THEMES } from "@/lib/esg";

interface EsgFilterBarProps {
  themes: string[];
  theme: string;
  onThemeChange: (value: string) => void;
  keywords: string[];
  keywordCounts: Record<string, number>;
  keyword: string;
  onKeywordChange: (value: string) => void;
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
  search,
  onSearchChange,
  onDownload,
  onPrint,
  visibleCount,
  totalCount,
}: EsgFilterBarProps) {
  return (
    <div className="mb-8 print:hidden">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Select value={theme} onValueChange={onThemeChange}>
            <SelectTrigger className="w-full sm:w-[220px]" aria-label="Filter by theme">
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
              className="w-full sm:w-[240px]"
              aria-label="Filter by keyword"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              <SelectItem value={ALL_KEYWORDS}>{ALL_KEYWORDS}</SelectItem>
              {keywords.map((kw) => (
                <SelectItem key={kw} value={kw}>
                  {kw} ({keywordCounts[kw]})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative w-full sm:w-[260px]">
            <Input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search disclosures…"
              autoComplete="off"
              aria-label="Search disclosures"
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

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={onDownload}>
            Download CSV
          </Button>
          <Button variant="outline" size="sm" onClick={onPrint}>
            Print / PDF
          </Button>
        </div>
      </div>

      <p className="mt-4 text-sm text-muted-foreground" aria-live="polite">
        Showing {visibleCount} of {totalCount} disclosures
      </p>
    </div>
  );
}
