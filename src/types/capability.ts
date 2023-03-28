export enum RedirectStatus {
  OPTIONAL = "optional",
  MANDATORY = "mandatory",
  NOT_AVAILABLE = "not_available",
}

export type Capability = {
  messageType: string;
  publisherId: string;
  originatingCountry: string;
  quadTree: Array<string>;
  redirect: RedirectStatus;
  shardCount: number;
  infoUrl: string;
};

export type LocalCapability = {
  id: string;
  path: string;
  definition: Capability;
};
