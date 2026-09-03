import { Fragment } from "react";
import { EsgRowData } from "@/lib/esg";
import { EsgRow } from "./EsgRow";

export function EsgTable({ rows }: { rows: EsgRowData[] }) {
  const groups: { category: string; rows: EsgRowData[] }[] = [];
  rows.forEach((row) => {
    const last = groups[groups.length - 1];
    if (last && last.category === row.category) last.rows.push(row);
    else groups.push({ category: row.category, rows: [row] });
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[860px] border-collapse text-left">
        <thead className="print:table-header-group">
          <tr className="border-b border-border">
            <th scope="col" className="py-3 pr-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Sub Factor
            </th>
            <th scope="col" className="py-3 pr-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Keywords
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
          {groups.map((group, gi) => (
            <Fragment key={`${group.category}-${gi}`}>
              <tr className="bg-secondary/60">
                <th
                  scope="colgroup"
                  colSpan={4}
                  className="py-2.5 px-3 text-sm font-semibold text-foreground"
                >
                  {group.category}
                </th>
              </tr>
              {group.rows.map((row, i) => (
                <EsgRow key={`${group.category}-${row.subfactor}-${i}`} row={row} />
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
