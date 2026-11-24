// Mission registry for Agra's real government extracts.
//
// Every mission in scope is registered, including the four with no Agra
// records in the current data pull. A mission with has_records: false must
// stay visible in the interface with its absence explained — never hidden,
// never rendered as an empty panel with no explanation.

export type AgraMissionId =
  | "MISSION-AGRA-PMAYU"
  | "MISSION-AGRA-PMSVANIDHI"
  | "MISSION-AGRA-AMRUT"
  | "MISSION-AGRA-URBAN-TRANSPORT"
  | "MISSION-AGRA-SBMU"
  | "MISSION-AGRA-DAYNULM"
  | "MISSION-AGRA-SMART-CITIES";

export interface AgraMissionRecord {
  mission_id: AgraMissionId;
  name: string;
  /** False when the current data pull holds no Agra records for this mission. */
  has_records: boolean;
  /** Honest statement of coverage, or of why records are absent. Never null. */
  note: string;
  /** Source ids from src/data/agra/sourceRegistry.ts backing this mission. */
  source_ids: readonly string[];
  /** Mission verticals present in Agra's data; empty when none are recorded. */
  verticals: readonly string[];
}

export const AGRA_MISSION_REGISTRY: readonly AgraMissionRecord[] = [
  {
    mission_id: "MISSION-AGRA-PMAYU",
    name: "PMAY-U (Pradhan Mantri Awas Yojana – Urban)",
    has_records: true,
    note:
      "Verticals present in Agra's data: BLC, AHP, CLSS, ISS, plus the legacy RAY and JnNURM. The source carries no physical or financial progress percentage and no service-readiness figure.",
    source_ids: ["SRC-AGRA-PMAYU-PROJECTS", "SRC-AGRA-PMAYU-BENEFICIARIES"],
    verticals: ["BLC", "AHP", "CLSS", "ISS", "RAY", "JnNURM"],
  },
  {
    mission_id: "MISSION-AGRA-PMSVANIDHI",
    name: "PM-SVANidhi",
    has_records: true,
    note:
      "ULB-level three-term loan funnel covering Agra's local bodies. Every numeric arrives as a string in the source.",
    source_ids: ["SRC-AGRA-PMSVANIDHI-ULB"],
    verticals: [],
  },
  {
    mission_id: "MISSION-AGRA-AMRUT",
    name: "AMRUT",
    has_records: false,
    note:
      "The only AMRUT record we hold is a Nani Daman project, not Agra.",
    source_ids: ["SRC-AGRA-AMRUT2-SAMPLE"],
    verticals: [],
  },
  {
    mission_id: "MISSION-AGRA-URBAN-TRANSPORT",
    name: "Urban Transport",
    has_records: true,
    note:
      "Agra MRTS station coordinates: 28 stations across two corridors, in degrees-minutes-seconds with no station identifier.",
    source_ids: ["SRC-AGRA-MRTS-STATIONS"],
    verticals: [],
  },
  {
    mission_id: "MISSION-AGRA-SBMU",
    name: "SBM-U (Swachh Bharat Mission – Urban)",
    has_records: false,
    note:
      "121 fields are declared in the divisional register and none has been tested against data.",
    source_ids: [],
    verticals: [],
  },
  {
    mission_id: "MISSION-AGRA-DAYNULM",
    name: "DAY-NULM",
    has_records: false,
    note:
      "The NULM extracts we hold cover Bihar, Andhra Pradesh and Goa samples, not Agra.",
    source_ids: [],
    verticals: [],
  },
  {
    mission_id: "MISSION-AGRA-SMART-CITIES",
    name: "Smart Cities Mission",
    has_records: false,
    note:
      "All 55 declared fields are access-restricted and need written approval before any extract can be requested.",
    source_ids: [],
    verticals: [],
  },
] as const;

export const AGRA_MISSIONS_BY_ID: Readonly<Record<AgraMissionId, AgraMissionRecord>> =
  Object.fromEntries(
    AGRA_MISSION_REGISTRY.map((entry) => [entry.mission_id, entry]),
  ) as Readonly<Record<AgraMissionId, AgraMissionRecord>>;

/** Resolve an Agra mission id to its registry entry. */
export function agraMissionById(
  missionId: string | null | undefined,
): AgraMissionRecord | null {
  if (!missionId) return null;
  return (AGRA_MISSIONS_BY_ID as Readonly<Record<string, AgraMissionRecord | undefined>>)[
    missionId
  ] ?? null;
}
