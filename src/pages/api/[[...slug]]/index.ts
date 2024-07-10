import type { NextApiRequest, NextApiResponse } from "next";
import { SubscriptionsSubscription } from "@/types/napcore/subscription";
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
import { Capability } from "@/types/napcore/capability";
import { getToken } from "next-auth/jwt";
import { causeCodes as causeCodesList } from "@/lib/data/causeCodes";
import { CertificateSignResponse } from "@/types/napcore/certificate";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
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
