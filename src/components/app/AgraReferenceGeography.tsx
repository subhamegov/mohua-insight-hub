import { useMemo, useState } from "react";
import { Breadcrumbs } from "@/components/app/Breadcrumbs";
import { PageHeader, Panel } from "@/components/app/Primitives";
import {
  AGRA_GEOGRAPHY_FEATURES,
  AGRA_REFERENCE_GEOGRAPHY,
  agraGeographySummary,
  displayAgraGeographyName,
  type AgraGeographyFeature,
} from "@/data/agra/referenceGeography";
import { agraSourceById } from "@/data/agra/sourceRegistry";
import { count, text } from "@/lib/format";

type FilterMode =
  | "all"
  | "Villages"
  | "Master_Plan_Boundary_Updated"
  | "Municipal_Boundary"
  | "unnamed";

const FILTER_TABS: { id: FilterMode; label: string }[] = [
  { id: "all", label: "All features" },
  { id: "Villages", label: "Village boundaries" },
  { id: "Master_Plan_Boundary_Updated", label: "Master Plan boundary" },
  { id: "Municipal_Boundary", label: "Municipal boundary" },
  { id: "unnamed", label: "Unnamed in source" },
];

function matchesFilter(feature: AgraGeographyFeature, filter: FilterMode, q: string): boolean {
  const p = feature.properties;
  if (filter === "unnamed" && p.name !== null) return false;
  if (
    filter !== "all" &&
    filter !== "unnamed" &&
    p.source_layer !== filter
  ) {
    return false;
  }
  if (!q) return true;
  const hay = [
    feature.id,
    p.source_feature_id,
    displayAgraGeographyName(p.name),
    p.alternate_name ?? "",
    p.source_layer,
    p.crs,
    ...Object.entries(p.raw_attributes).map(([k, v]) => `${k} ${v}`),
  ]
    .join(" ")
    .toLowerCase();
  return hay.includes(q);
}

function rawAttributeSummary(feature: AgraGeographyFeature): string {
  const p = feature.properties;
  if (p.source_layer === "Villages") {
    if (p.name === null) return "NAME: (empty), Name_1: (empty)";
    if (p.alternate_name && p.alternate_name !== p.name) {
      return `Name_1: ${p.alternate_name}`;
    }
    if (p.alternate_name === null) return "Name_1: (empty)";
    return "—";
  }
  return Object.entries(p.raw_attributes)
    .map(([k, v]) => `${k}: ${v}`)
    .join(" · ");
}

export function AgraReferenceGeography() {
  const [filter, setFilter] = useState<FilterMode>("all");
  const [query, setQuery] = useState("");
  const summary = useMemo(() => agraGeographySummary(), []);
  const source = agraSourceById(AGRA_REFERENCE_GEOGRAPHY.source_id);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return AGRA_GEOGRAPHY_FEATURES.filter((f) => matchesFilter(f, filter, q));
  }, [filter, query]);

  const tabCount = (id: FilterMode): number => {
    if (id === "all") return summary.total;
    if (id === "Villages") return summary.villages;
    if (id === "unnamed") return summary.unnamedVillages;
    return AGRA_GEOGRAPHY_FEATURES.filter((f) => f.properties.source_layer === id).length;
  };

  return (
    <div className="space-y-5">
      <Breadcrumbs trail={[{ label: "Localities" }]} />
      <PageHeader
        title="Reference geography: Agra"
        subtitle={`${count(summary.total)} boundary features loaded from the Agra Master Plan 2031 shapefile attribute tables (${count(summary.villages)} village boundaries, ${count(summary.boundaries)} planning and municipal boundaries).`}
      />

      <Panel
        title="Geometry status: geometry pending"
        description={AGRA_REFERENCE_GEOGRAPHY.geometry_note}
      >
        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="field-label">Features loaded</dt>
            <dd className="num text-sm font-medium">{count(summary.total)}</dd>
          </div>
          <div>
            <dt className="field-label">Village boundaries</dt>
            <dd className="num text-sm font-medium">
              {count(summary.villages)} ({count(summary.namedVillages)} named,{" "}
              {count(summary.unnamedVillages)} unnamed)
            </dd>
          </div>
          <div>
            <dt className="field-label">Plotted coordinates</dt>
            <dd className="num text-sm font-medium">0 (geometry null on all features)</dd>
          </div>
          <div>
            <dt className="field-label">Source &amp; date</dt>
            <dd className="text-sm">
              {source ? `${source.title} (${source.source_id})` : AGRA_REFERENCE_GEOGRAPHY.source_id}
              {" · "}Accessed {AGRA_REFERENCE_GEOGRAPHY.accessed_date}
            </dd>
          </div>
        </dl>
        <p className="mt-3 text-xs text-muted-foreground">
          Record type: {AGRA_REFERENCE_GEOGRAPHY.record_type}. Source URL:{" "}
          {text(source?.url ?? null)}. Coordinate reference system is recorded per feature
          because other layers in the same Master Plan package use different projections.
        </p>
      </Panel>

      <Panel
        title="Boundary features"
        description="Source attribute tables preserved verbatim. Blank village names are carried as null and displayed as Unnamed."
      >
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {FILTER_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setFilter(t.id)}
              aria-pressed={filter === t.id}
              className={`rounded-sm border px-2.5 py-1 text-xs ${
                filter === t.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:bg-accent"
              }`}
            >
              {t.label} ({count(tabCount(t.id))})
            </button>
          ))}
        </div>

        <input
          aria-label="Search Agra reference geography"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, unnamed, layer, feature ID, or CRS"
          className="mb-3 w-full max-w-md rounded-sm border border-border bg-background px-3 py-2 text-sm"
        />

        <div className="overflow-x-auto">
          <table className="w-full min-w-[52rem] text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="field-label py-2 pr-3">Name</th>
                <th className="field-label py-2 pr-3">Feature ID</th>
                <th className="field-label py-2 pr-3">Layer</th>
                <th className="field-label py-2 pr-3">CRS (per feature)</th>
                <th className="field-label py-2 pr-3">Geometry</th>
                <th className="field-label py-2">Source attributes</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((f) => {
                const p = f.properties;
                const isUnnamed = p.name === null;
                return (
                  <tr key={f.id} className="border-b border-border/60 align-top">
                    <td className="py-2 pr-3">
                      {isUnnamed ? (
                        <span className="italic text-muted-foreground">
                          {displayAgraGeographyName(p.name)}
                          <span className="ml-1.5 not-italic text-xs">(blank in source)</span>
                        </span>
                      ) : (
                        <span className="font-medium text-foreground">{p.name}</span>
                      )}
                    </td>
                    <td className="num py-2 pr-3 text-xs text-muted-foreground">
                      {f.id}
                      <span className="block">source #{p.source_feature_id}</span>
                    </td>
                    <td className="py-2 pr-3 text-xs">{p.source_layer}</td>
                    <td className="num py-2 pr-3 text-xs">{p.crs}</td>
                    <td className="py-2 pr-3 text-xs text-muted-foreground">
                      Not available (geometry pending · {p.source_geometry_type})
                    </td>
                    <td className="py-2 text-xs text-muted-foreground">
                      {rawAttributeSummary(f)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}