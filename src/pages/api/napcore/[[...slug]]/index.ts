import type { NextApiRequest, NextApiResponse } from "next";
import {
  fetchNetworkCapabilities,
  fetchCapabilities,
  fetchSubscriptions,
  fetchDeliveries,
  addSubscriptions,
  deleteSubscriptions,
} from "@/lib/interchangeConnector";

// all getter methods on path
const getPaths: {
  [key: string]: (params: any) => Promise<any>;
} = {
  "network/capabilities": fetchNetworkCapabilities,
  capabilities: fetchCapabilities,
  subscriptions: fetchSubscriptions,
  deliveries: fetchDeliveries,
};

// all post methods on path
const postPaths: {
  [key: string]: (params: any) => Promise<any>;
} = {
  subscriptions: addSubscriptions,
};

// all delete methods on path
const deletePaths: {
  [key: string]: (params: any) => Promise<any>;
} = {
  subscriptions: deleteSubscriptions,
};

const findHandler: (params: any) =>
  | {
      fn: (arg0: any) => Promise<any>;
      params: any;
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
      break;
    case "POST":
      if (Object.keys(postPaths).includes(urlPath)) {
        return { fn: postPaths[urlPath], params: { actorCommonName, body } };
      }
      break;
    case "DELETE":
      if (path.length > 1 && Object.keys(deletePaths).includes(path[0])) {
        return {
          fn: deletePaths[path[0]],
          params: { actorCommonName, pathParam: path[1] },
        };
      }
      break;
    default:
      return {};
  }
  return {};
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
    // need to handle 404 if no data found on selector or pathParam
    if (executer && "fn" in executer) {
      const { fn, params } = executer;
      const data = fn(params);
      return res.status(200).json(data);
    }
  }
  return res.status(404).json({ description: `Page not found: ${urlPath}` });
}
