import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { Capabilities } from "@/types/capability";
import { getTLSAgent } from "@/lib/sslAgent";
import { SubscriptionRequest } from "@/types/napcore/subscription";

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
  const response = await axios.get(uri + uriPath, {
    params,
    headers,
    httpsAgent: agent,
  });

  return await response.data;
};

const postIXN: (
  userName: string,
  path: string,
  body: SubscriptionRequest
) => Promise<any> = async (userName, path, body) => {
  const uri = process.env.INTERCHANGE_URI || "";
  const uriPath = `${userName}${path}`;
  const agent = getTLSAgent();
  const response = await axios.post(uri + uriPath, body, {
    headers,
    httpsAgent: agent,
  });
  return await response.data;
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
  return capabilities;
};

const fetchCapabilities = async (userName: string, selector: string = "") => {
  const capabilities: Capabilities = await fetchIXN(
    userName,
    "/capabilities",
    selector
  );
  return capabilities;
};

const fetchSubscriptions = async (userName: string, selector: string = "") => {
  const subscriptions = await fetchIXN(userName, "/subscriptions", selector);
  return subscriptions;
};

const fetchDeliveries = (userName: string, selector: string = "") => {
  return fetchIXN(userName, "/deliveries", selector);
};

const addSubscriptions = (userName: string, body: SubscriptionRequest) => {
  return postIXN(userName, "/subscriptions", body);
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

const postPaths: {
  [key: string]: (
    userName: string,
    request: SubscriptionRequest
  ) => Promise<any>;
} = {
  subscriptions: addSubscriptions,
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
    let data = {};
    switch (method) {
      case "GET":
        data = await getPaths[urlPath](actorCommonName, selector);
        res.status(200).json(data);
        break;
      case "POST":
        data = await postPaths[urlPath](actorCommonName, req.body);
        res.status(200).json(data);
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
