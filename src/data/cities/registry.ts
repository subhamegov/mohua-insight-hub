import ahmedabadBanner from "@/assets/cities/ahmedabad-city-banner.png.asset.json";
import guwahatiBanner from "@/assets/cities/guwahati-city-banner.png.asset.json";
import jalandharBanner from "@/assets/cities/jalandhar-city-banner.png.asset.json";
import suratBanner from "@/assets/cities/surat-city-banner.png.asset.json";
import thaneBanner from "@/assets/cities/thane-city-banner.png.asset.json";

// City registry for the MoHUA Urban Intelligence application.
//
// One application, many cities. Each city carries only its identity and
// reference geography here; records live in the per-city datasets
// (see ./datasets.ts). No values are invented: where a city has no loaded
// records, the dataset is empty and the UI says so.

export type CityId =
  | "CITY-JALANDHAR"
  | "CITY-THANE"
  | "CITY-SURAT"
  | "CITY-AHMEDABAD"
  | "CITY-GUWAHATI"
  | "CITY-KARNAL"
  | "CITY-AGRA";

export interface AdditionalLocalBody {
  /**
   * Local Government Directory (LGD) code — the identifier of record for this
   * local body. The name is only a label and must never be used to join.
   */
  lgd_code: string;
  /** Display label only; never use as a join key. */
  name: string;
  /** Statutory body classification. */
  body_type: "development_authority" | "cantonment_board";
}

export interface CityProfile {
  city_id: CityId;
  /** Short name used in navigation and headings. */
  name: string;
  state: string;
  /** Urban local body of record. */
  urban_local_body: string;
  /**
   * Local Government Directory (LGD) code for the primary urban local body.
   *
   * This is the identifier of record and the name is only a label. In our
   * source data two schemes disagree on the state for 64 LGD codes, and
   * matching two schemes' ULB lists by name alone produced no exact matches
   * at all, so names must never be used to join.
   */
  lgd_code: string | null;
  /**
   * Additional local bodies that report inside the city's scope (such as a
   * development authority or cantonment board). Empty when none are recorded.
   */
  additional_local_bodies: AdditionalLocalBody[];
  /** Approximate city centre for map orientation only. */
  centre: [number, number];
  /** Map bounding box as [south, west, north, east] for OSM queries. */
  bbox: [number, number, number, number];
  /** Whether government records have been ingested for this city yet. */
  data_loaded: boolean;
  /** Approved decorative city illustration. Not a government identity asset. */
  bannerImage: string | null;
}

export const CITIES: CityProfile[] = [
  {
    city_id: "CITY-JALANDHAR",
    name: "Jalandhar",
    state: "Punjab",
    urban_local_body: "Municipal Corporation Jalandhar",
    lgd_code: null,
    additional_local_bodies: [],
    centre: [31.326, 75.5762],
    bbox: [31.2456, 75.4772, 31.4152, 75.6866],
    data_loaded: true,
    bannerImage: jalandharBanner.url,
  },
  {
    city_id: "CITY-THANE",
    name: "Thane",
    state: "Maharashtra",
    urban_local_body: "Thane Municipal Corporation",
    lgd_code: null,
    additional_local_bodies: [],
    centre: [19.2183, 72.9781],
    bbox: [19.13, 72.89, 19.32, 73.08],
    data_loaded: true,
    bannerImage: thaneBanner.url,
  },
  {
    city_id: "CITY-SURAT",
    name: "Surat",
    state: "Gujarat",
    urban_local_body: "Surat Municipal Corporation",
    lgd_code: null,
    additional_local_bodies: [],
    centre: [21.1702, 72.8311],
    bbox: [21.05, 72.7, 21.29, 72.96],
    data_loaded: true,
    bannerImage: suratBanner.url,
  },
  {
    city_id: "CITY-AHMEDABAD",
    name: "Ahmedabad",
    state: "Gujarat",
    urban_local_body: "Ahmedabad Municipal Corporation",
    lgd_code: null,
    additional_local_bodies: [],
    centre: [23.0225, 72.5714],
    bbox: [22.91, 72.45, 23.15, 72.71],
    data_loaded: true,
    bannerImage: ahmedabadBanner.url,
  },
  {
    city_id: "CITY-GUWAHATI",
    name: "Guwahati",
    state: "Assam",
    urban_local_body: "Guwahati Municipal Corporation",
    lgd_code: null,
    additional_local_bodies: [],
    centre: [26.1445, 91.7362],
    bbox: [26.05, 91.6, 26.24, 91.9],
    data_loaded: true,
    bannerImage: guwahatiBanner.url,
  },
  {
    city_id: "CITY-KARNAL",
    name: "Karnal",
    state: "Haryana",
    urban_local_body: "Municipal Corporation Karnal",
    lgd_code: null,
    additional_local_bodies: [],
    centre: [29.6803, 76.9896],
    bbox: [29.61, 76.91, 29.75, 77.07],
    data_loaded: true,
    bannerImage: null,
  },
  {
    city_id: "CITY-AGRA",
    name: "Agra",
    state: "Uttar Pradesh",
    urban_local_body: "Agra Municipal Corporation",
    lgd_code: "249062",
    additional_local_bodies: [
      {
        lgd_code: "770109",
        name: "Agra Development Authority",
        body_type: "development_authority",
      },
      {
        lgd_code: "277255",
        name: "Cantonment Board, Agra",
        body_type: "cantonment_board",
      },
    ],
    centre: [27.1767, 78.0081],
    bbox: [26.9, 77.7, 27.5, 78.25],
    data_loaded: false,
    bannerImage: null,
  },
];

export const DEFAULT_CITY_ID: CityId = "CITY-SURAT";

export function cityProfile(id: CityId): CityProfile {
  return CITIES.find((c) => c.city_id === id) ?? CITIES[0]!;
}

export function isCityId(value: string | null | undefined): value is CityId {
  return Boolean(value) && CITIES.some((c) => c.city_id === value);
}
