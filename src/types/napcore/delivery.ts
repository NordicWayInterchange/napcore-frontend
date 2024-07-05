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
};

export type DeliveriesDelivery = {
  id: string;
  selector: string;
  lastUpdatedTimeStamp: number;
  status: DeliveryStatus;
  endpoints: Array<Endpoint>;
};

export type Delivery = DeliveriesDelivery | { endpoints: Endpoint };

export type Deliveries = {
  name: string;
  deliveries: Array<DeliveriesDelivery>;
};