import { Application } from "./napcore/capability";

export type ExtendedCapability = Application & {
  id: number;
  causeCodesDictionary: Array<causeCodesDictionary>;
};

type causeCodesDictionary = {
  code: number;
  message: string;
};
