// these needs to be faced out and use the ones from napcore after new structure
// is rolled out on the ixn.

import { RedirectStatus } from "./napcore/Capability";

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

export type LocalCapability = {
  id: string;
  path: string;
  definition: Capability;
};

export type Capabilities = {
  name: string;
  selector: string;
  capabilities: Array<LocalCapability>;
  version: string;
};
