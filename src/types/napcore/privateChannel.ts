export enum PrivateChannelStatus {
  REQUESTED = "requested",
  CREATED = "created",
  ILLEGAL = "illegal",
  NOT_VALID = "not_valid",
  NO_OVERLAP = "no_overlap",
  RESUBSCRIBE = "resubscribe",
}

export type PrivateChannelEndpoint = {
  host: string;
  port: number;
  queueName: string;
};

export type Peers = {
  id: string;
  name: string;
};

export type PrivateChannel = {
  id: string;
  privateChannelStatus: PrivateChannelStatus;
  description: string;
  peers: Array<Peers>;
  serviceProviderName: string;
  privateChannelEndpoint: Array<PrivateChannelEndpoint>;
};