// Per-city datasets.
//
// Cities fall into three provenance categories:
// - "curated": hand-curated reference records (Jalandhar)
// - "government_records": loaded real government extracts (Agra)
// - "synthetic_prototype": adapted synthetic prototype records (Thane, Surat,
//   Ahmedabad, Guwahati, Karnal)

import { agencies, assets, evidence, projects, schemes } from "../jalandhar";
import { adaptedRecords } from "../four-city/adapter";
import type { Agency, Asset, Evidence, Project, Scheme } from "../types";
import { CITIES, type CityId, type CityProfile, cityProfile } from "./registry";

export type CityDatasetProvenance =
  | "curated"
  | "government_records"
  | "synthetic_prototype";

export interface CityDataset {
  profile: CityProfile;
  projects: Project[];
  assets: Asset[];
  schemes: Scheme[];
  agencies: Agency[];
  evidence: Evidence[];
  /** Distinguishes hand-curated, real government extract, and synthetic prototype datasets. */
  provenance: CityDatasetProvenance;
  /** Derived from provenance === "synthetic_prototype" for existing call sites. */
  readonly synthetic: boolean;
}

const EMPTY = {
  projects: [] as Project[],
  assets: [] as Asset[],
  schemes: [] as Scheme[],
  agencies: [] as Agency[],
  evidence: [] as Evidence[],
};

function buildDataset(
  id: CityId,
  provenance: CityDatasetProvenance,
  records: typeof EMPTY,
): CityDataset {
  return {
    profile: cityProfile(id),
    ...records,
    provenance,
    get synthetic() {
      return this.provenance === "synthetic_prototype";
    },
  };
}

function fourCity(id: CityId): CityDataset {
  return buildDataset(id, "synthetic_prototype", adaptedRecords(id) ?? EMPTY);
}

const DATASETS: Record<CityId, CityDataset> = {
  "CITY-JALANDHAR": buildDataset("CITY-JALANDHAR", "curated", {
    projects,
    assets,
    schemes,
    agencies,
    evidence,
  }),
  "CITY-THANE": fourCity("CITY-THANE"),
  "CITY-SURAT": fourCity("CITY-SURAT"),
  "CITY-AHMEDABAD": fourCity("CITY-AHMEDABAD"),
  "CITY-GUWAHATI": fourCity("CITY-GUWAHATI"),
  "CITY-KARNAL": fourCity("CITY-KARNAL"),
  "CITY-AGRA": buildDataset("CITY-AGRA", "government_records", EMPTY),
};

export function datasetFor(id: CityId): CityDataset {
  return DATASETS[id];
}

export function allDatasets(): CityDataset[] {
  return CITIES.map((c) => DATASETS[c.city_id]);
}

export function hasRecords(id: CityId): boolean {
  return datasetFor(id).projects.length > 0;
}

/** True only for hand-curated city datasets (Jalandhar), never for government extracts or synthetic prototypes. */
export function isCurated(dataset: Pick<CityDataset, "provenance">): boolean {
  return dataset.provenance === "curated";
}
