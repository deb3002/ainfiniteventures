import { Fragment } from "react";
import {
  ALL_FRAMEWORKS,
  EsgRowData,
  IFC_ORDER,
  groupKey,
  groupLabel,
} from "@/lib/esg";
import { EsgRow } from "./EsgRow";

interface EsgTableProps {
  rows: EsgRowData[];
  framework?: string;
  ifcNames?: Record<string, string>;
}

export function EsgTable({
  rows,
  framework = ALL_FRAMEWORKS,
  ifcNames = {},
}: EsgTableProps) {
  const buckets = new Map<string, EsgRowData[]>();
  rows.forEach((row) => {
    const key = groupKey(row, framework);
    const list = buckets.get(key);
    if (list) list.push(row);
    else buckets.set(key, [row]);
  });

  let keys = Array.from(buckets.keys());
  if (framework === "IFC") {
    keys = keys.sort((a, b) => {
      const ia = IFC_ORDER.indexOf(a);
      const ib = IFC_ORDER.indexOf(b);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[860px] border-collapse text-left">
        <thead className="print:table-header-group">
          <tr className="border-b border-border">
            <th scope="col" className="py-3 pr-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Sub Factor
            </th>
            <th scope="col" className="py-3 pr-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Frameworks &amp; Keywords
            </th>
            <th scope="col" className="py-3 pr-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Documents
            </th>
            <th scope="col" className="py-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Highlights
            </th>
          </tr>
        </thead>
        <tbody>
          {keys.map((key) => {
            const groupRows = buckets.get(key)!;
            const label = groupLabel(key, framework, ifcNames);
            return (
              <Fragment key={key}>
                <tr className="bg-secondary/60">
                  <th
                    scope="colgroup"
                    colSpan={4}
                    className="py-2.5 px-3 text-sm font-semibold text-foreground"
                  >
                    <span className="flex flex-wrap items-center gap-3">
                      {label.code && (
                        <span className="rounded bg-accent/15 px-1.5 py-0.5 text-[11px] font-semibold tracking-wide text-accent">
                          {label.code}
                        </span>
                      )}
                      <span>{label.name}</span>
                      <span className="text-xs font-normal text-muted-foreground">
                        {groupRows.length}{" "}
                        {groupRows.length === 1 ? "disclosure" : "disclosures"}
                      </span>
                    </span>
                  </th>
                </tr>
                {groupRows.map((row, i) => (
                  <EsgRow key={`${key}-${row.subfactor}-${i}`} row={row} />
                ))}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
