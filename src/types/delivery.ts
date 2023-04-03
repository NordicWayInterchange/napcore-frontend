export enum DeliveryStatus {
  REQUESTED = "requested",
  CREATED = "created",
  ILLEGAL = "illegal",
  NOT_VALID = "not_valid",
  NO_OVERLAP = "no_overlap",
}

export type Delivery = {
  id: string;
  path: string;
  selector: string;
  lastUpdatedTime: number;
  status: DeliveryStatus;
};

export type Deliveries = {
  name: string;
  deliveries: Array<Delivery>;
};
