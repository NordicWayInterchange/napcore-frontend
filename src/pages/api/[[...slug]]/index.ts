import type { NextApiRequest, NextApiResponse } from "next";
import {
  createSubscription,
  deleteSubscriptions,
  getCapabilities,
  getNetworkCapabilities,
  getSubscriptions,
} from "@/lib/napcoreFetchers";
import { Subscriptions } from "@/types/napcore/subscription";
import {
  basicDeleteFunction,
  basicDeleteParams,
  basicGetFunction,
  basicGetParams,
  basicPostFunction,
  basicPostParams,
  extendedGetFunction,
  extendedGetParams,
} from "@/lib/interchangeConnector";
import { ExtendedCapability } from "@/types/capability";
import { Capabilities, Capability } from "@/types/napcore/capability";

const fetchCapabilityCounter = async (params: basicGetParams) => {
  const { actorCommonName, selector = "" } = params;
  const [status, body] = await fetchNetworkCapabilities({
    actorCommonName,
    selector,
  });

  if (status == 200) {
    const capabilities = body as ExtendedCapability[];
    return [status, capabilities.length];
  }
  return [status, body];
};

const fetchAggregate = async (params: basicGetParams) => {
  const { actorCommonName, selector } = params;
  const [status, body] = await fetchNetworkCapabilities({
    actorCommonName,
    selector,
  });
  if (status == 200) {
    const capabilities = body as ExtendedCapability[];
    const aggregatedCapabilities = capabilities.reduce(
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
    return [status, aggregatedCapabilities];
  }
  return [status, body];
};

const fetchSubscriptions = async (params: extendedGetParams) => {
  const { actorCommonName, selector = "", pathParam = "" } = params;
  const res = await getSubscriptions(actorCommonName, selector, pathParam);
  if (res.ok) {
    const subscriptions: Subscriptions = await res.json();
    return [res.status, subscriptions.subscriptions];
  }
  const body = await res.json();
  return [res.status, body];
};

export const addSubscriptions: basicPostFunction = async (
  params: basicPostParams
) => {
  const { actorCommonName, body = {} } = params;
  const res = await createSubscription(actorCommonName, body);
  const data = await res.json();
  return [res.status, data];
};

export const removeSubscription: basicDeleteFunction = async (
  params: basicDeleteParams
) => {
  const { actorCommonName, pathParam } = params;
  const res = await deleteSubscriptions(actorCommonName, pathParam);
  const data = await res.json();
  return [res.status, data];
};

const fetchNetworkCapabilities = async (params: basicGetParams) => {
  const { actorCommonName, selector = "" } = params;
  const res = await getNetworkCapabilities(actorCommonName, selector);
  if (res.ok) {
    const capabilities: Capabilities = await res.json();
    return [
      res.status,
      capabilities.capabilities.map((capability, ix) => {
        return { ...capability.application, id: ix };
      }),
    ];
  }
  const body = await res.json();
  return [res.status, body];
};

const fetchCapabilities = async (params: basicGetParams) => {
  const { actorCommonName, selector = "" } = params;
  const res = await getCapabilities(actorCommonName, selector);
  if (res.ok) {
    const capabilities: Capabilities = await res.json();
    return [
      res.status,
      capabilities.capabilities.map((capability, ix) => {
        return { ...capability, id: ix };
      }),
    ];
  }
  const body = await res.json();
  return [res.status, body];
};

// all internal fetchers
const getPaths: {
  [key: string]: basicGetFunction | extendedGetFunction;
} = {
  aggregate: fetchAggregate,
  "capability-count": fetchCapabilityCounter,
  subscriptions: fetchSubscriptions,
  "network/capabilities": fetchNetworkCapabilities,
  capabilities: fetchCapabilities,
};

// all post methods on path
const postPaths: {
  [key: string]: basicPostFunction;
} = {
  subscriptions: addSubscriptions,
};

// all delete methods on path
const deletePaths: {
  [key: string]: basicDeleteFunction;
} = {
  subscriptions: removeSubscription,
};

const findHandler: (params: any) =>
  | {
      fn:
        | basicDeleteFunction
        | basicGetFunction
        | basicPostFunction
        | extendedGetFunction;
      params:
        | basicDeleteParams
        | basicPostParams
        | basicGetParams
        | extendedGetParams;
    }
  | {} = (params) => {
  const {
    path = [],
    method,
    body = {},
    actorCommonName,
    selector = "",
  } = params;
  const urlPath = path.join("/");
  switch (method) {
    case "GET":
      const possiblePaths = Object.keys(getPaths);
      if (possiblePaths.includes(urlPath)) {
        return {
          fn: getPaths[urlPath],
          params: { actorCommonName, selector },
        };
      }
      if (path.length > 1 && possiblePaths.includes(path[0])) {
        return {
          fn: getPaths[path[0]],
          params: { actorCommonName, pathParam: path[1] },
        };
      }
    case "POST":
      if (Object.keys(postPaths).includes(urlPath)) {
        return { fn: postPaths[urlPath], params: { actorCommonName, body } };
      }
    case "DELETE":
      if (path.length > 1 && Object.keys(deletePaths).includes(path[0])) {
        return {
          fn: deletePaths[path[0]],
          params: { actorCommonName, pathParam: path[1] },
        };
      }
    default:
      return {};
  }
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
  const { method, body } = req;

  if (actorCommonName && path) {
    const executer = findHandler({
      method,
      path,
      body,
      actorCommonName,
      selector,
    });

    if (executer && "fn" in executer) {
      const { fn, params } = executer;
      const [status, resBody] = await fn(params);
      if (status != 200) {
        console.error(resBody);
      }
      return res.status(status).json(resBody);
    }
  }
  return res.status(404).json({ description: `Page not found: ${urlPath}` });
}
