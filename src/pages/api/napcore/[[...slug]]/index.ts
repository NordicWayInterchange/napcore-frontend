import type { NextApiRequest, NextApiResponse } from "next";
import {
  fetchNetworkCapabilities,
  fetchCapabilities,
  fetchSubscriptions,
  fetchDeliveries,
  addSubscriptions,
  deleteSubscriptions,
  basicGetFunction,
  extendedGetFunction,
  basicDeleteFunction,
  basicPostFunction,
  basicDeleteParams,
  basicPostParams,
  basicGetParams,
  extendedGetParams,
  addCertificates,
} from "@/lib/fetchers/interchangeConnector";
import { getToken } from "next-auth/jwt";

// all getter methods on path
const getPaths: {
  [key: string]: basicGetFunction | extendedGetFunction;
} = {
  "network/capabilities": fetchNetworkCapabilities,
  capabilities: fetchCapabilities,
  subscriptions: fetchSubscriptions,
  deliveries: fetchDeliveries,
};

// all post methods on path
const postPaths: {
  [key: string]: basicPostFunction;
} = {
  subscriptions: addSubscriptions,
  "x509/csr": addCertificates,
};

// all delete methods on path
const deletePaths: {
  [key: string]: basicDeleteFunction;
} = {
  subscriptions: deleteSubscriptions,
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
  /*  const secret = process.env.NEXTAUTH_SECRET;
  const token = await getToken({ req, secret, raw: true });
  if (!token) {
    // TODO: make it more descriptive
    return res.status(403).json({ description: `Access denied` });
  }*/

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
    // TODO: need to handle 404 if no data found on selector or pathParam
    if (executer && "fn" in executer) {
      try {
        const { fn, params } = executer;
        // @ts-ignore
        const response = await fn(params);
        return res.status(200).json(response.data);
      } catch (error: any) {
        console.log("error:", error);
        return res.status(error.response.status).json(error.response.data);
      }
    }
  }
  return res.status(404).json({ description: `Page not found: ${urlPath}` });
}
