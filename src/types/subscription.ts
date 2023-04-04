export enum SubscriptionStatus {
  REQUESTED = "requested",
  CREATED = "created",
  ILLEGAL = "illegal",
  NOT_VALID = "not_valid",
  RESUBSCRIBE = "resubscribe",
}

export type Subscription = {
  id: string;
  path: string;
  selector: string;
  consumerCommonName: string;
  lastUpdatedTimeStamp: number;
  status: SubscriptionStatus;
};

export type ExtendedSubscription = Subscription | { capabilityMatches: number };

export type Subscriptions = {
  name: string; // the name of the user which created the subscriptions
  version: number;
  subscriptions: Array<Subscription>;
};
