// Agra reference geography loaded from the Agra Master Plan 2031 shapefile
// attribute tables (masterplan-villages.tsv and masterplan-other-layers.tsv).
//
// Rules enforced here:
// - Every feature carries geometry: null because shapefile polygons exist in
//   the source package but have not yet been converted. No centroid,
//   bounding-box midpoint, or other invented coordinate is placed.
// - Coordinate reference system (crs) is stored on every feature rather than
//   assumed for the whole collection, because other layers in the same Master
//   Plan package use different coordinate systems.
// - Two villages have blank names in the source; they carry name: null and
//   render as "Unnamed" in the interface rather than being filled in or dropped.

import rawCollection from "./raw/reference_geography.geojson.json";
import type { AgraSourceId } from "./sourceRegistry";

export type AgraGeographyLayer =
  | "Villages"
  | "Master_Plan_Boundary_Updated"
  | "Municipal_Boundary";

export type AgraGeographyRole =
  | "village_boundary"
  | "master_plan_boundary"
  | "municipal_boundary";

export interface AgraGeographyProperties {
  id: string;
  city_id: "CITY-AGRA";
  record_type: "VERIFIED";
  source_id: AgraSourceId;
  source_file: "masterplan-villages.tsv" | "masterplan-other-layers.tsv";
  source_layer: AgraGeographyLayer;
  source_feature_id: string;
  source_geometry_type: "Polygon";
  observation_date: string;
  feature_role: AgraGeographyRole;
  /** Exact name from the source attribute table; null when blank in source. */
  name: string | null;
  /** Secondary Name_1 value from masterplan-villages.tsv when non-empty. */
  alternate_name: string | null;
  /** Coordinate reference system recorded per feature, never assumed collection-wide. */
  crs: string;
  is_official_boundary: true;
  /** Raw source attributes preserved verbatim without rounding or correction. */
  raw_attributes: Readonly<Record<string, string>>;
}

export interface AgraGeographyFeature {
  type: "Feature";
  id: string;
  /** Always null until source shapefile polygons are converted. */
  geometry: null;
  properties: AgraGeographyProperties;
}

export interface AgraReferenceGeographyCollection {
  type: "FeatureCollection";
  city_id: "CITY-AGRA";
  source_id: AgraSourceId;
  accessed_date: string;
  record_type: "VERIFIED";
  /** True while shapefile polygon geometry awaits conversion. */
  geometry_pending: true;
  geometry_note: string;
  features: readonly AgraGeographyFeature[];
}

export const AGRA_REFERENCE_GEOGRAPHY =
  rawCollection as unknown as AgraReferenceGeographyCollection;

export const AGRA_GEOGRAPHY_FEATURES: readonly AgraGeographyFeature[] =
  AGRA_REFERENCE_GEOGRAPHY.features;

export const AGRA_GEOGRAPHY_BY_ID: Readonly<Record<string, AgraGeographyFeature>> =
  Object.fromEntries(AGRA_GEOGRAPHY_FEATURES.map((f) => [f.id, f]));

export function agraGeographyById(
  id: string | null | undefined,
): AgraGeographyFeature | null {
  if (!id) return null;
  return AGRA_GEOGRAPHY_BY_ID[id] ?? null;
}

/** Display label for a geography feature name: renders null names explicitly as "Unnamed". */
export function displayAgraGeographyName(name: string | null): string {
  return name === null ? "Unnamed" : name;
}

export function agraGeographySummary() {
  const features = AGRA_GEOGRAPHY_FEATURES;
  const villages = features.filter((f) => f.properties.feature_role === "village_boundary");
  const unnamedVillages = villages.filter((f) => f.properties.name === null);
  const boundaries = features.filter((f) => f.properties.feature_role !== "village_boundary");
  const crsList = [...new Set(features.map((f) => f.properties.crs))];
  return {
    total: features.length,
    villages: villages.length,
    namedVillages: villages.length - unnamedVillages.length,
    unnamedVillages: unnamedVillages.length,
    boundaries: boundaries.length,
    geometryPending: AGRA_REFERENCE_GEOGRAPHY.geometry_pending,
    crsList,
  };
}