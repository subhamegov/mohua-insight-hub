// Source registry for Agra's real government extracts.
//
// Mirrors the shape of src/data/four-city/raw/21_source_registry.json, adding
// a scope flag ("agra" | "national" | "not_agra") and keeping Agra provenance
// strictly separate from the four-city synthetic registry. Every url is null
// because public URLs are not available and must never be guessed.

export type AgraSourceScope = "agra" | "national" | "not_agra";

export type AgraSourceId =
  | "SRC-AGRA-PMAYU-PROJECTS"
  | "SRC-AGRA-PMAYU-BENEFICIARIES"
  | "SRC-AGRA-PMSVANIDHI-ULB"
  | "SRC-AGRA-AMRUT2-SAMPLE"
  | "SRC-AGRA-POI"
  | "SRC-AGRA-MRTS-STATIONS"
  | "SRC-AGRA-MASTERPLAN-2031";

export interface AgraSourceRecord {
  source_id: AgraSourceId;
  title: string;
  /** Null when no verified public URL exists; never invent or guess a URL. */
  url: string | null;
  publication_date: string | null;
  accessed_date: string;
  scope: AgraSourceScope;
  verified_context: string;
}

export const AGRA_SOURCE_REGISTRY: readonly AgraSourceRecord[] = [
  {
    source_id: "SRC-AGRA-PMAYU-PROJECTS",
    title: "PMAY-U project extract",
    url: null,
    publication_date: null,
    accessed_date: "2026-11-24",
    scope: "national",
    verified_context:
      "50,373 national project rows across 5,317 local bodies; 27 rows belong to Agra bodies. Carries Local Government Directory (LGD) codes.",
  },
  {
    source_id: "SRC-AGRA-PMAYU-BENEFICIARIES",
    title: "PMAY-U beneficiary extract",
    url: null,
    publication_date: null,
    accessed_date: "2026-11-24",
    scope: "agra",
    verified_context:
      "25,596 beneficiary records; all 25,512 geocoded records fall inside the Agra bounding box, so the file is Agra in scope. Holds personal data and is never loaded into this application; only a suppressed aggregate is loaded.",
  },
  {
    source_id: "SRC-AGRA-PMSVANIDHI-ULB",
    title: "PM-SVANidhi ULB loan funnel",
    url: null,
    publication_date: null,
    accessed_date: "2026-11-24",
    scope: "national",
    verified_context:
      "Three-term loan funnel for 4,088 local bodies. Every numeric arrives as a string.",
  },
  {
    source_id: "SRC-AGRA-AMRUT2-SAMPLE",
    title: "AMRUT 2.0 project sample",
    url: null,
    publication_date: null,
    accessed_date: "2026-11-24",
    scope: "not_agra",
    verified_context:
      "One sewerage project at Nani Daman. Not an Agra record; registered because it establishes the AMRUT payload shape.",
  },
  {
    source_id: "SRC-AGRA-POI",
    title: "Agra point-of-interest layers",
    url: null,
    publication_date: null,
    accessed_date: "2026-11-24",
    scope: "agra",
    verified_context:
      "417 points across 19 layers, 348 with usable coordinates. Bilingual names.",
  },
  {
    source_id: "SRC-AGRA-MRTS-STATIONS",
    title: "Agra MRTS station coordinates",
    url: null,
    publication_date: null,
    accessed_date: "2026-11-24",
    scope: "agra",
    verified_context:
      "28 stations across two corridors. Coordinates are in degrees-minutes-seconds with no station identifier.",
  },
  {
    source_id: "SRC-AGRA-MASTERPLAN-2031",
    title: "Agra Master Plan 2031 package",
    url: null,
    publication_date: null,
    accessed_date: "2026-11-24",
    scope: "agra",
    verified_context:
      "18 shapefile layers, 8,548 features, in three different coordinate systems.",
  },
] as const;

export const AGRA_SOURCES_BY_ID: Readonly<Record<AgraSourceId, AgraSourceRecord>> =
  Object.fromEntries(
    AGRA_SOURCE_REGISTRY.map((entry) => [entry.source_id, entry]),
  ) as Readonly<Record<AgraSourceId, AgraSourceRecord>>;

/** Resolve an Agra source id to its registry entry (title, accessed_date, scope, context). */
export function agraSourceById(
  sourceId: string | null | undefined,
): AgraSourceRecord | null {
  if (!sourceId) return null;
  return (AGRA_SOURCES_BY_ID as Readonly<Record<string, AgraSourceRecord | undefined>>)[
    sourceId
  ] ?? null;
}