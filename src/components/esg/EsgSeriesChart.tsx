import { EsgSeries, formatMetricValue } from "@/lib/esg";

const BAR_W = 26;
const BAR_GAP = 12;
const PLOT_H = 46;
const LABEL_H = 15;

function seriesTitle(series: EsgSeries) {
  return series.measure + (series.unit ? ` (${series.unit})` : "");
}

function Chart({ series }: { series: EsgSeries }) {
  const pts = series.points;
  const width = BAR_GAP + pts.length * (BAR_W + BAR_GAP);
  const height = PLOT_H + LABEL_H;
  const breaks = series.breaks ?? [];
  const max = pts.reduce((m, p) => (p.value > m ? p.value : m), 0);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`${seriesTitle(series)}: ${pts
        .map((p) => `${p.year} ${p.value}`)
        .join(", ")}`}
      className="mt-2"
    >
      {pts.map((p, i) => {
        const x = BAR_GAP + i * (BAR_W + BAR_GAP);
        const h = max > 0 ? Math.max(1, Math.round((p.value / max) * (PLOT_H - 6))) : 1;
        const preBreak = breaks.length > 0 && i < breaks[0];
        return (
          <g key={p.year}>
            <rect
              x={x}
              y={PLOT_H - h}
              width={BAR_W}
              height={h}
              rx={1}
              className={preBreak ? "fill-muted-foreground/40" : "fill-accent"}
            />
            <text
              x={x + BAR_W / 2}
              y={height - 3}
              textAnchor="middle"
              className="fill-muted-foreground text-[10px]"
            >
              {p.year}
            </text>
          </g>
        );
      })}
      <line
        x1={0}
        y1={PLOT_H}
        x2={width}
        y2={PLOT_H}
        className="stroke-border"
        strokeWidth={1}
      />
      {breaks.map((i) => {
        const x = BAR_GAP + i * (BAR_W + BAR_GAP) - BAR_GAP / 2;
        return (
          <line
            key={i}
            x1={x}
            y1={0}
            x2={x}
            y2={PLOT_H}
            className="stroke-muted-foreground/60"
            strokeWidth={1}
            strokeDasharray="3 3"
          />
        );
      })}
    </svg>
  );
}

export function EsgSeriesChart({ series }: { series: EsgSeries }) {
  const pts = series.points;
  const latest = pts[pts.length - 1];
  const prior = pts[0];

  return (
    <div
      className={`rounded-xl border p-4 ${
        series.flagged ? "border-accent/50 bg-accent/5" : "border-border bg-secondary/40"
      }`}
    >
      <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {seriesTitle(series)}
      </div>

      {pts.length >= 3 ? (
        <>
          <Chart series={series} />
          <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
            {pts.map((p) => (
              <li key={p.year} className="text-xs text-muted-foreground">
                <span className="mr-1.5">{p.year}</span>
                <span className="font-semibold text-foreground tabular-nums">
                  {formatMetricValue(p.value)}
                </span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">
          <span className="text-base font-semibold text-foreground tabular-nums">
            {formatMetricValue(latest.value)}
          </span>{" "}
          in {latest.year}
          {pts.length > 1 && (
            <>
              ,{" "}
              {latest.value === prior.value
                ? "unchanged from"
                : latest.value > prior.value
                  ? "up from"
                  : "down from"}{" "}
              {formatMetricValue(prior.value)} in {prior.year}
            </>
          )}
        </p>
      )}

      {series.flagged && series.note && (
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          {series.note}
        </p>
      )}
    </div>
  );
}
