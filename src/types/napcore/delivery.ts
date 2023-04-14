export enum DeliveryStatus {
  REQUESTED = "requested",
  CREATED = "created",
  ILLEGAL = "illegal",
  NOT_VALID = "not_valid",
  NO_OVERLAP = "no_overlap",
}

export type Endpoint = {
  host: string;
  port: number;
  target: string;
  source: string;
  maxBandwidth: number;
  maxMessageRate: number;
};

export type DeliveriesDelivery = {
  id: string;
  path: string;
  selector: string;
  lastUpdatedTime: number;
  status: DeliveryStatus;
};

export type Delivery = DeliveriesDelivery | { endpoints: Endpoint };

export type Deliveries = {
  name: string;
  deliveries: Array<DeliveriesDelivery>;
};
