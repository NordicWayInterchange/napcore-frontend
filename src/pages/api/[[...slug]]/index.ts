import type { NextApiRequest, NextApiResponse } from "next";
import { SubscriptionsSubscription } from "@/types/napcore/subscription";
import {
  addNapcoreCertificates, addNapcoreDeliveries,
  addNapcoreCapabilities,
  addNapcoreSubscriptions,
  basicDeleteFunction,
  basicDeleteParams,
  basicGetFunction,
  basicGetParams,
  basicPostFunction,
  deleteNapcoreDeliveries,
  basicPostParams, deleteNapcoreCapabilities,
  deleteNapcoreSubscriptions,
  extendedGetFunction,
  fetchNapcoreCapabilities,
  extendedGetParams, fetchNapcoreDeliveries,
  fetchNapcoreDeliveriesCapabilities,
  fetchNapcoreNetworkCapabilities,
  fetchNapcoreSubscriptions, fetchNapcorePublicationIds
} from "@/lib/fetchers/interchangeConnector";
import { ExtendedCapability } from "@/types/capability";
import { Capability, Publicationids } from "@/types/napcore/capability";
import { getToken } from "next-auth/jwt";
import { causeCodes as causeCodesList } from "@/lib/data/causeCodes";
import { CertificateSignResponse } from "@/types/napcore/certificate";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { DeliveriesDelivery } from "@/types/napcore/delivery";
import { ExtendedDelivery } from "@/types/delivery";
const logger = require("../../../lib/logger");

const fetchCapabilityCounter = async (params: basicGetParams) => {
  const [status, body] = await fetchNetworkCapabilities(params);
  const capabilities = body as Array<ExtendedCapability>;
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
  const subscriptions: SubscriptionsSubscription = await res.data;
  return [res.status, subscriptions];
};

const fetchDeliveries = async (params: basicGetParams) => {
  const res = await fetchNapcoreDeliveries(params);
  const deliveries: Array<DeliveriesDelivery> = res.data;
  return [res.status, deliveries];
};

const fetchDeliveriesCapabilityCounter = async (params: basicGetParams) => {
  const [status, body] = await fetchDeliveriesCapabilities(params);
  const deliveries = body as Array<ExtendedDelivery>;
  return [status, deliveries.length];
}

export const addDeliveries: basicPostFunction = async (
  params: basicPostParams
) => {
  const res = await addNapcoreDeliveries(params);
  const deliveries: DeliveriesDelivery = await res.data;
  return [res.status, deliveries];
};

function extractCauseCodes(capability: Capability) {
  let causeCodes;
  if (
    "causeCode" in capability.application &&
    capability.application.causeCode
  ) {
    causeCodes = capability.application.causeCode.map((causeCode) => {
      return causeCodesList.find((c) => c.value === causeCode) || { "value": causeCode};
    });
  }
  return causeCodes;
}

const fetchUserCapabilities = async (params: extendedGetParams) => {
  const res = await fetchNapcoreCapabilities(params);
  const userCapabilities: Array<Capability> = await res.data;
  return [
    res.status,
    userCapabilities.map((userCapability) => {
      let causeCodes= extractCauseCodes(userCapability);

      return {
        ...userCapability.application,
        causeCodesDictionary: causeCodes && causeCodes.filter(Boolean),
        id: userCapability.id,
      };
    }),
  ];
};

const fetchPublicationIds = async (params: extendedGetParams) => {
  const res = await fetchNapcorePublicationIds(params);
  debugger
  const ids: Publicationids = await res.data;
  return [res.status, ids];
};

export const addUserCapabilities: basicPostFunction = async (
  params: basicPostParams
) => {
  const res = await addNapcoreCapabilities(params);
  const userCapabilities: Capability = await res.data;
  return [res.status, userCapabilities];
};

export const removeUserCapability: basicDeleteFunction = async (
  params: basicDeleteParams
) => {
  const res = await deleteNapcoreCapabilities(params);
  return [res.status];
};

export const addCerticates: basicPostFunction = async (
  params: basicPostParams
) => {
  const res = await addNapcoreCertificates(params);
  const certificate: CertificateSignResponse = await res.data;
  return [res.status, certificate];
};

export const removeSubscription: basicDeleteFunction = async (
  params: basicDeleteParams
) => {
  const res = await deleteNapcoreSubscriptions(params);
  return [res.status];
};

export const removeDelivery: basicDeleteFunction = async (
  params: basicDeleteParams
) => {
  const res = await deleteNapcoreDeliveries(params);
  return [res.status];
};

const fetchNetworkCapabilities = async (params: basicGetParams) => {
  const res = await fetchNapcoreNetworkCapabilities(params);
  const capabilities: Array<Capability> = res.data;
  return [
    res.status,
    capabilities.map((capability) => {
      let causeCodes  = extractCauseCodes(capability);

      return {
        ...capability.application,
        causeCodesDictionary: causeCodes && causeCodes.filter(Boolean),
      };
    }),
  ];
};

const fetchDeliveriesCapabilities = async (params: basicGetParams) => {
  const res = await fetchNapcoreDeliveriesCapabilities(params);
  const deliveries: Array<Capability> = res.data;
  return [
    res.status,
    deliveries.map((delivery) => {
      return {
        ...delivery.application,
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
  deliveries: fetchDeliveries,
  "delivery-count": fetchDeliveriesCapabilityCounter,
  "deliveries/capabilities": fetchDeliveriesCapabilities,
  "user/capabilities": fetchUserCapabilities,
  "capabilities/publicationids": fetchPublicationIds
};

// all post methods on path
const postPaths: {
  [key: string]: basicPostFunction;
} = {
  subscriptions: addSubscriptions,
  deliveries: addDeliveries,
  "x509/csr": addCerticates,
  capabilities: addUserCapabilities
};

// all delete methods on path
const deletePaths: {
  [key: string]: basicDeleteFunction;
} = {
  subscriptions: removeSubscription,
  deliveries: removeDelivery,
  capabilities: removeUserCapability,
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

const isAuthenticated = async (req: NextApiRequest, res: NextApiResponse) => {
  const secret = process.env.NEXTAUTH_SECRET;
  const token = await getToken({ req, secret, raw: true });
  const session = await getServerSession(req, res, authOptions);

  return !(
    !token ||
    !session ||
    !req.query.slug ||
    !session.user ||
    session.user.commonName !== req.query.slug[0]
  );
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!(await isAuthenticated(req, res))) {
    logger.info(
      "Access denied - " +
        "User with email: " +
        session.user.email +
        ", don't have permission to perform this action"
    );

    return res
      .status(403)
      .json({ description: `Access denied - You don't have permission` });
  }

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

        logger
          .child({
            params,
            method: req.method,
            httpStatus: status,
            url: req.url,
            user: session.user,
            slug: req.query.slug,
          })
          .info();

        return res.status(status).json(data);
      } catch (error: any) {
        if(error.response) {
	        logger.error({
            errorStatus: error.response.status,
            errorData: error.response.data,
          });
          return res.status(error.response.status).json(error.response.data);
	      } else {
	        logger.error(error.message);
          return res.status(500).json("Error fetching from server");
        }
      }
    }
  }

  logger.info("Page not found: " + urlPath);
  return res.status(404).json({ description: `Page not found: ${urlPath}` });
}
