export enum RedirectStatus {
  OPTIONAL = "optional",
  MANDATORY = "mandatory",
  NOT_AVAILABLE = "not_available",
}

export type Application = {
  messageType: string;
  publisherId: string;
  protocolVersion: string;
  publicationId: string;
  quadTree: Array<string>;
  causeCodes?: Array<number>;
};

export type Metadata = {
  shardCount: number;
  infoUrl: string;
  redirectPolicy: RedirectStatus;
  maxBandwidth: number;
  maxMessageRate: number;
  repetitionInterval: number;
};

export type Capability = {
  application: Application;
  metadata: Metadata;
};

export type Capabilities = {
  name: string;
  selector: string;
  capabilities: Array<Capability>;
  version: string;
};
