import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { Capabilities } from "@/types/capability";
import { getTLSAgent } from "@/lib/sslAgent";

const headers = {
  Accept: "application/json",
};
const fetchIXN: (
  userName: string,
  path: string
) => Promise<Capabilities> = async (userName, path) => {
  const uri = process.env.INTERCHANGE_URI || "";
  const uriPath = `${userName}${path}`;
  const agent = getTLSAgent();
  const respons = await axios(uri + uriPath, { headers, httpsAgent: agent });

  return await respons.data;
};

const fetchNetworkCapabilities = (userName: string) => {
  return fetchIXN(userName, "/network/capabilities");
};

const fetchCapabilities = (userName: string) => {
  return fetchIXN(userName, "/capabilities");
};

const fetchSubscriptions = (userName: string) => {
  return fetchIXN(userName, "/subscriptions");
};

const fetchDeliveries = (userName: string) => {
  return fetchIXN(userName, "/deliveries");
};

const paths: { [key: string]: (userName: string) => Promise<any> } = {
  "network/capabilities": fetchNetworkCapabilities,
  capabilities: fetchCapabilities,
  subscriptions: fetchSubscriptions,
  deliveries: fetchDeliveries,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const slug = Array.isArray(req.query.slug)
    ? req.query.slug
    : [req.query.slug];

  const [actorCommonName, ...path] = slug;
  const urlPath = path.join("/");
  if (actorCommonName && urlPath in paths) {
    const data = await paths[urlPath](actorCommonName);
    res.status(200).json(data);
  }
  res.status(404).json({ description: `Page not found: ${urlPath}` });
}
