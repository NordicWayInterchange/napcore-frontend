export enum PrivateChannelStatus {
  REQUESTED = "requested",
  CREATED = "created",
  ILLEGAL = "illegal",
  NOT_VALID = "not_valid"
}

export type EndPoint = {
  host: string;
  port: number;
  queueName: string;
};

export type PrivateChannel = {
  id: string;
  peers: Array<string>;
  status: PrivateChannelStatus;
  description: string;
  endpoint: EndPoint;
  lastUpdated: number;
};

export type PrivateChannelPeers = {
  id: string;
  owner: string;
  description: string;
  status: PrivateChannelStatus;
  endpoint: EndPoint;
  lastUpdated: number;
};

export type PrivateChannelRequest = {
  peerToAdd: string;
};