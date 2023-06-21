import { Application } from "./napcore/capability";

export type ExtendedCapability = Application & {
  id: number;
  causeCodesDictionary: Array<causeCodesDictionary>;
};

type causeCodesDictionary = {
  value: number;
  label: string;
};
