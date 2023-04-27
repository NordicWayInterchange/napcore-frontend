import { Application } from "./napcore/capability";

export type ExtendedCapability = Application & {
  id: number;
};
