import { Capability } from "./capability";

export enum MessageTypes {
  DATEX_2 = "DATEX2",
  DENM = "DENM",
  IVIM = "IVIM",
  SPATEM = "SPATEM",
  MAPEM = "MAPEM",
  SREM = "SREM",
  SSEM = "SSEM",
  CAM = "CAM",
}

export type DatexCapability = Capability & {
  publicationTypes: Array<string>;
};
export type CamCapability = Capability & { stationTypes: Array<string> };
export type IvimCapability = Capability & { iviType: Array<string> };
export type DenmCapability = Capability & { causeCode: Array<string> };
export type SpatemCapability = Capability & { ids: Array<string> };
export type MapemCapability = Capability & { ids: Array<string> };
export type SremCapability = Capability & { ids: Array<string> };
export type SsemCapability = Capability & { ids: Array<string> };
