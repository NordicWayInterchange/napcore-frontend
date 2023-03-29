export type Subscription = {
  id: number;
  messageType: string;
  originatingCountry: string;
  status: string;
  color: string;
};

export type Subscriptions = Array<Subscription>;
