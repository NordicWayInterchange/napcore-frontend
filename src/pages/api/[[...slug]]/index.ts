import type { NextApiRequest, NextApiResponse } from "next";
import { Capabilities, Capability } from "@/types/capability";
import { getNetworkCapabilities } from "@/lib/fetchers";

const fetchCapabilityCounter = async (userName: string, selector?: string) => {
  // query param selector
  const res = await getNetworkCapabilities(userName, selector);
  const capabilities: Capabilities[] = await res.json();
  return capabilities.length;
};

const fetchAggregate = async (userName: string, selector: string = "") => {
  const res = await getNetworkCapabilities(userName, selector);
  const capabilities: Capabilities[] = await res.json();
  return capabilities.reduce(
    (acc: { [key: string]: any }, capability: Capability) => {
      (Object.keys(capability) as Array<keyof typeof capability>).forEach(
        (capabilityProp) => {
          let value = Array.isArray(capability[capabilityProp])
            ? (capability[capabilityProp] as Array<string>)
            : [capability[capabilityProp] as string];
          if (capabilityProp in acc) {
            // get only new values
            value = value.filter((val) => !acc[capabilityProp].includes(val));
            acc[capabilityProp] = [...acc[capabilityProp], ...value];
          } else {
            acc[capabilityProp] = value;
          }
        }
      );
      return acc;
    },
    {}
  );
};

// all internal fetchers
const getInternal: {
  [key: string]: (userName: string, selector?: string) => any;
} = {
  aggregate: fetchAggregate,
  ["capability-count"]: fetchCapabilityCounter,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const slug = Array.isArray(req.query.slug)
    ? req.query.slug
    : [req.query.slug];

  const selector = Array.isArray(req.query.selector)
    ? req.query.selector[0]
    : req.query.selector;
  const [actorCommonName, ...path] = slug;
  const urlPath = path.join("/");

  if (actorCommonName && [...Object.keys(getInternal)].includes(urlPath)) {
    const { method } = req;

    switch (method) {
      case "GET":
        const data = await getInternal[urlPath](actorCommonName, selector);
        res.status(200).json(data);
        break;
      case "POST":
        res.status(405).end(`Method ${method} Not Implemented yet`);
        break;
      default:
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
        break;
    }
    return;
  }
  return res.status(404).json({ description: `Page not found: ${urlPath}` });
}
