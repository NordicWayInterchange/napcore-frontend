import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { Capabilities, Capability, LocalCapability } from "@/types/capability";
import { getTLSAgent } from "@/lib/sslAgent";

const headers = {
  Accept: "application/json",
};

const fetchIXN: (
  userName: string,
  path: string,
  selector?: string
) => Promise<any> = async (userName, path, selector = "") => {
  const uri = process.env.INTERCHANGE_URI || "";
  const uriPath = `${userName}${path}`;
  const agent = getTLSAgent();
  const params: { selector?: string } = {};
  if (selector) {
    params.selector = selector;
  }
  const respons = await axios(uri + uriPath, {
    params,
    headers,
    httpsAgent: agent,
  });

  return await respons.data;
};

const fetchNetworkCapabilities = async (
  userName: string,
  selector: string = ""
) => {
  const capabilities: Capabilities = await fetchIXN(
    userName,
    "/network/capabilities",
    selector
  );
  return capabilities.capabilities.map((capability) => {
    return capability.definition;
  });
};

const fetchCapabilities = async (userName: string, selector: string = "") => {
  const capabilities: Capabilities = await fetchIXN(
    userName,
    "/capabilities",
    selector
  );
  return capabilities.capabilities.map((capability) => {
    return capability.definition;
  });
};

const fetchSubscriptions = (userName: string, selector: string = "") => {
  return fetchIXN(userName, "/subscriptions", selector);
};

const fetchDeliveries = (userName: string, selector: string = "") => {
  return fetchIXN(userName, "/deliveries", selector);
};

const fetchCapabilityCounter = async (userName: string, selector?: string) => {
  const capabilities = await fetchNetworkCapabilities(userName, selector);
  return capabilities.length;
};

const fetchAggregate = async (userName: string, selector?: string) => {
  const capabilities = await fetchNetworkCapabilities(userName, selector);

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

// all getter methods on path
const getPaths: {
  [key: string]: (userName: string, selector?: string) => Promise<any>;
} = {
  "network/capabilities": fetchNetworkCapabilities,
  capabilities: fetchCapabilities,
  subscriptions: fetchSubscriptions,
  deliveries: fetchDeliveries,
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

  if (actorCommonName && [...Object.keys(getPaths)].includes(urlPath)) {
    const { method } = req;

    switch (method) {
      case "GET":
        const data = await getPaths[urlPath](actorCommonName, selector);
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
  if (actorCommonName && [...Object.keys(getInternal)].includes(urlPath)) {
    try {
      const data = await getInternal[urlPath](actorCommonName, selector);
      return res.status(200).json(data);
    } catch (err) {
      return res.status(err.response.status).json(err.data);
    }
  }
  return res.status(404).json({ description: `Page not found: ${urlPath}` });
}
