export enum RedirectStatus {
  OPTIONAL = "optional",
  MANDATORY = "mandatory",
  NOT_AVAILABLE = "not_available",
}

export type Capability = {
  messageType: string;
  publisherId: string;
  originatingCountry: string;
  protocolVersion: string;
  quadTree: Array<string>;
  redirect: RedirectStatus;
  shardCount: number;
  infoUrl: string;
};

export type Capabilities = {
  name: string; // the name of the user which created the subscriptions
  selector: string;
  version: number;
  capabilities: Array<Capability>;
};

export type LocalCapability = {
  id: string;
  path: string;
  definition: Capability;
};

export type Capabilities = {
  name: string;
  selector: string;
  capabilities: Array<Capability>;
  version: string;
};
