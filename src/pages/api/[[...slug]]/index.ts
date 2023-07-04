import type { NextApiRequest, NextApiResponse } from "next";
import {
  SubscriptionRequest,
  SubscriptionsSubscription,
} from "@/types/napcore/subscription";
import {
  addNapcoreCertificates,
  addNapcoreSubscriptions,
  basicDeleteFunction,
  basicDeleteParams,
  basicGetFunction,
  basicGetParams,
  basicPostFunction,
  basicPostParams,
  deleteNapcoreSubscriptions,
  extendedGetFunction,
  extendedGetParams,
  fetchNapcoreNetworkCapabilities,
  fetchNapcoreSubscriptions,
} from "@/lib/fetchers/interchangeConnector";
import { ExtendedCapability } from "@/types/capability";
import { Capabilities, Capability } from "@/types/napcore/capability";
import { getToken } from "next-auth/jwt";
import { causeCodes as causeCodesList } from "@/lib/data/causeCodes";
import { CertificateSignRequest } from "@/types/napcore/csr";

const fetchCapabilityCounter = async (params: basicGetParams) => {
  const [status, body] = await fetchNetworkCapabilities(params);
  const capabilities = body as ExtendedCapability[];
  return [status, capabilities.length];
};

const fetchSubscriptions = async (params: extendedGetParams) => {
  const res = await fetchNapcoreSubscriptions(params);
  const subscriptions: Array<SubscriptionsSubscription> = await res.data;
  return [res.status, subscriptions];
};

export const addSubscriptions: basicPostFunction = async (
  params: basicPostParams
) => {
  const res = await addNapcoreSubscriptions(params);
  const subscriptions: SubscriptionRequest = await res.data;
  return [res.status, subscriptions];
};

export const addCerticates: basicPostFunction = async (
  params: basicPostParams
) => {
  const res = await addNapcoreCertificates(params);
  const certificate: CertificateSignRequest = await res.data;
  return [res.status, certificate];
};

export const removeSubscription: basicDeleteFunction = async (
  params: basicDeleteParams
) => {
  const res = await deleteNapcoreSubscriptions(params);
  const subscription = await res.data;
  return [res.status, subscription];
};

const fetchNetworkCapabilities = async (params: basicGetParams) => {
  const res = await fetchNapcoreNetworkCapabilities(params);
  const capabilities: Array<Capability> = res.data;
  return [
    res.status,
    capabilities.map((capability) => {
      let causeCodes;

      if (
        "causeCodes" in capability.application &&
        capability.application.causeCodes
      ) {
        causeCodes = capability.application.causeCodes.map((causeCode) => {
          return causeCodesList.find((c) => c.value === causeCode);
        });
      }

      return {
        ...capability.application,
        causeCodesDictionary: causeCodes && causeCodes.filter(Boolean),
      };
    }),
  ];
};

// all internal fetchers
const getPaths: {
  [key: string]: basicGetFunction | extendedGetFunction;
} = {
  "capability-count": fetchCapabilityCounter,
  subscriptions: fetchSubscriptions,
  "network/capabilities": fetchNetworkCapabilities,
};

// all post methods on path
const postPaths: {
  [key: string]: basicPostFunction;
} = {
  subscriptions: addSubscriptions,
  "x509/csr": addCerticates,
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
  const secret = process.env.NEXTAUTH_SECRET;
  const token = await getToken({ req, secret, raw: true });
  if (!token) {
    return res
      .status(403)
      .json({ description: `Access denied - You don't have permission` });
  }

  console.log(req.query);

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
      try {
        const { fn, params } = executer;
        const [status, data] = await fn(params);
        return res.status(status).json(data);
      } catch (error: any) {
        return res.status(error.response.status).json(error.response.data);
      }
    }
  }
  return res.status(404).json({ description: `Page not found: ${urlPath}` });
}
