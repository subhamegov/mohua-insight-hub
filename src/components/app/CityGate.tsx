import { Link, useRouterState } from "@tanstack/react-router";
import { useCity } from "@/lib/cityContext";
import { FourCityOverview } from "@/components/app/FourCityOverview";
import { Unavailable } from "@/components/app/Unavailable";
import { isCurated } from "@/data/cities/datasets";
import { AGRA_MISSION_REGISTRY } from "@/data/agra/missionRegistry";
import { agraGeographySummary } from "@/data/agra/referenceGeography";
import type { ReactNode } from "react";

/**
 * City views render records for the active city only.
 *
 * Three cases are handled honestly:
 *  - the city has records: its pages render normally;
 *  - the city is served by the four-city dataset and the page depends on an
 *    analysis built specifically for Jalandhar: the page says so instead of
 *    showing another city's reasoning;
 *  - the city is registered but no records are loaded: the page says so.
 */

/** Pages whose analysis is built on Jalandhar-specific reference work. */
const JALANDHAR_ONLY = ["/outcomes", "/attention", "/wards"];

/** Pages that sit above the city level and always render. */
const CITY_INDEPENDENT = ["/national", "/compare", "/states"];

export function CityGate({ children }: { children: ReactNode }) {
  const { city, dataset, portfolio } = useCity();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  // An unmatched URL only resolves to the root match. Let it through so the
  // not-found page is shown instead of a city or national panel.
  const matchCount = useRouterState({ select: (s) => s.matches.length });
  if (matchCount <= 1) return <>{children}</>;

  if (CITY_INDEPENDENT.some((p) => pathname.startsWith(p))) return <>{children}</>;

  // Explicit All Cities context: city pages do not silently fall back to one
  // city's records, and no city's figures are added together.
  if (portfolio) return <PortfolioContext />;

  // Agra's Master Plan 2031 reference geography is loaded ahead of project records.
  if (city.city_id === "CITY-AGRA" && pathname === "/localities") {
    return <>{children}</>;
  }

  if (dataset.projects.length === 0) return <NoRecords />;

  if (dataset.synthetic) {
    if (pathname === "/") return <FourCityOverview />;
  }

  if (!isCurated(dataset)) {
    const blocked = JALANDHAR_ONLY.find((p) => pathname.startsWith(p));
    if (blocked) return <NotBuiltForCity page={blocked} cityName={city.name} />;
  }

  return <>{children}</>;
}

function PortfolioContext() {
  const { cities, setCityId } = useCity();
  return (
    <section className="rounded-sm border border-border bg-card p-5 shadow-sm">
      <p className="field-label">All cities</p>
      <h2 className="mt-1 text-lg font-semibold text-foreground">
        Four-city prototype coverage
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Four-city prototype coverage. Figures stay separate by city and are never added into a portfolio total.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          to="/compare"
          className="rounded-sm border border-input bg-card px-3 py-1.5 text-sm hover:bg-accent"
        >
          Compare cities
        </Link>
        <Link
          to="/national"
          className="rounded-sm border border-input bg-card px-3 py-1.5 text-sm hover:bg-accent"
        >
          National view
        </Link>
      </div>
      <ul className="mt-4 flex flex-wrap gap-2">
        {cities.map((c) => (
          <li key={c.city_id}>
            <button
              type="button"
              onClick={() => setCityId(c.city_id)}
              className="rounded-sm border border-input bg-card px-3 py-1.5 text-sm hover:bg-accent"
            >
              {c.name}, {c.state}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function NotBuiltForCity({ page, cityName }: { page: string; cityName: string }) {
  const label = page.replace("/", "");
  return (
    <Unavailable
      title={`This view is not available for ${cityName}`}
      detail={`The ${label} analysis uses Jalandhar-specific indicators, priorities and ward records. It is not applied to ${cityName}. Other views use ${cityName}'s own records.`}
    />
  );
}

const BODY_TYPE_LABEL: Record<string, string> = {
  development_authority: "Development authority",
  cantonment_board: "Cantonment board",
};

function NoRecords() {
  const { city } = useCity();
  const isAgra = city.city_id === "CITY-AGRA";
  const agraGeo = isAgra ? agraGeographySummary() : null;
  const missionsWithRecords = isAgra ? AGRA_MISSION_REGISTRY.filter((m) => m.has_records) : [];
  const missionsWithoutRecords = isAgra ? AGRA_MISSION_REGISTRY.filter((m) => !m.has_records) : [];
  const localBodies = [
    { name: city.urban_local_body, lgd: city.lgd_code, role: "Urban local body" },
    ...city.additional_local_bodies.map((b) => ({
      name: b.name,
      lgd: b.lgd_code,
      role: BODY_TYPE_LABEL[b.body_type] ?? b.body_type,
    })),
  ];

  return (
    <section className="space-y-5 rounded-sm border border-border bg-card p-5 shadow-sm">
      <div>
        <p className="field-label">{city.city_id}</p>
        <h2 className="mt-1 text-lg font-semibold text-foreground">
          {city.name} is registered — record tables are not yet loaded
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          {city.name}, {city.state}, has no project, asset, scheme, housing, finance, or grievance
          record tables loaded yet. No figures are borrowed from Jalandhar or the synthetic
          prototype cities, and missing counts are never shown as zero.
        </p>
      </div>

      <div>
        <h3 className="field-label">Local bodies in scope</h3>
        <ul className="mt-2 divide-y divide-border/60 rounded-sm border border-border text-sm">
          {localBodies.map((body) => (
            <li
              key={`${body.name}-${body.lgd ?? "none"}`}
              className="flex flex-wrap items-baseline justify-between gap-2 px-3 py-2"
            >
              <span className="font-medium text-foreground">{body.name}</span>
              <span className="text-xs text-muted-foreground">
                {body.role} · LGD <span className="num">{body.lgd ?? "Not available"}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      {isAgra ? (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-sm border border-border p-3">
            <h3 className="field-label">Missions with Agra records (tables pending load)</h3>
            <ul className="mt-2 space-y-2 text-sm">
              {missionsWithRecords.map((m) => (
                <li key={m.mission_id}>
                  <p className="font-medium text-foreground">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.note}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-sm border border-border p-3">
            <h3 className="field-label">Missions with no Agra records in this pull</h3>
            <ul className="mt-2 space-y-2 text-sm">
              {missionsWithoutRecords.map((m) => (
                <li key={m.mission_id}>
                  <p className="font-medium text-foreground">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.note}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      <dl className="grid gap-3 border-t border-border pt-4 sm:grid-cols-3">
        <div>
          <dt className="field-label">City identifier</dt>
          <dd className="num text-sm">{city.city_id}</dd>
        </div>
        <div>
          <dt className="field-label">Map centre</dt>
          <dd className="num text-sm">
            {city.centre[0].toFixed(4)}, {city.centre[1].toFixed(4)}
          </dd>
        </div>
        <div>
          <dt className="field-label">Reference data loaded</dt>
          <dd className="num text-sm">
            {agraGeo
              ? `${agraGeo.total} reference geography features (geometry pending)`
              : "Not available"}
          </dd>
        </div>
      </dl>
      {agraGeo ? (
        <div>
          <Link
            to="/localities"
            className="inline-block rounded-sm border border-input bg-card px-3 py-1.5 text-sm hover:bg-accent"
          >
            Open Agra reference geography ({agraGeo.total} features)
          </Link>
        </div>
      ) : null}
    </section>
  );
}
