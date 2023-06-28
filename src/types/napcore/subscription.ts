export enum SubscriptionStatus {
  REQUESTED = "requested",
  CREATED = "created",
  ILLEGAL = "illegal",
  NOT_VALID = "not_valid",
  NO_OVERLAP = "no_overlap",
  RESUBSCRIBE = "resubscribe",
}

export type Endpoint = {
  host: string;
  port: number;
  source: string;
  maxBandwidth: number;
  maxMessageRate: number;
};

export type SubscriptionsSubscription = {
  id: string; // TODO: INT
  selector: string;
  lastUpdatedTimestamp: number;
  status: SubscriptionStatus;
  endpoints: Array<Endpoint>;
};

export type Subscriptions = {
  name: string;
  subscriptions: SubscriptionsSubscription[];
  version: string;
};

export type SubscriptionRequest = {
  selector: string;
};
