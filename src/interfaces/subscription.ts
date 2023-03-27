interface Subscription {
  id: number;
  messageType: string;
  originatingCountry: string;
  status: string;
  color: string;
}

export interface Subscriptions extends Array<Subscription> {}
